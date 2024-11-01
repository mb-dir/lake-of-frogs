import { useState } from "react";
import Field from "../Field/Field";
import Frog from "../Frog/Frog";
import "./index.css";

const Board = () => {
	const rows = 6;
	const cols = 10;
	const lake = [];

	const [frogs, setFrogs] = useState([
		{
			sex: "male",
			row: 0,
			col: 0,
		},
		{
			sex: "female",
			row: 0,
			col: 1,
		},
	]);

	const [checkedIndexes, setCheckedIndexes] = useState<
		{ col: number; row: number }[]
	>([
		{ col: 0, row: 0 },
		{ col: 1, row: 0 },
	]);

	const isTwoFieldsChecked = checkedIndexes.length > 1;

	function canFrogJump() {
		const checkedFrogs = frogs.filter((frog) =>
			checkedIndexes.some(
				(cord) => frog.col === cord.col && frog.row === cord.row
			)
		);

		// We have only one forg checked and two checked fields - that means 2nd checked field is not a frog, so frog can jump there
		return checkedFrogs.length === 1 && checkedIndexes.length === 2;
	}

	// Generate grid elements
	for (let row = 0; row < rows; row++) {
		const rowFields = [];
		for (let col = 0; col < cols; col++) {
			const frog = frogs.find((el) => el.row === row && el.col === col);
			const isChecked = checkedIndexes.some(
				(el) => el.row === row && el.col === col
			);
			const isDisabled = isTwoFieldsChecked && !isChecked;

			rowFields.push(
				<Field
					isChecked={isChecked}
					isDisabled={isDisabled}
					col={col}
					row={row}
					frog={frog}
					key={`${row}-${col}`}
					setCheckedIndexes={setCheckedIndexes}
				/>
			);
		}
		lake.push(
			<div key={row} className="board-row">
				{rowFields}
			</div>
		);
	}

	function jump() {
		const frog = frogs.filter((frog) =>
			checkedIndexes.find(
				(cord) => frog.col === cord.col && frog.row === cord.row
			)
		)[0];

		const newIndexes = checkedIndexes.find(
			(cord) => !(frog.col === cord.col && frog.row === cord.row)
		);

		if (newIndexes) {
			const updatedFrogs = frogs.map((f) =>
				f.col === frog.col && f.row === frog.row
					? { ...f, col: newIndexes.col, row: newIndexes.row }
					: f
			);
			setFrogs(updatedFrogs);
			setCheckedIndexes([]);
		}
	}

	return (
		<div className="container">
			<div className="board">{lake}</div>
			<div className="description">
				<div className="legend">
					<span>Legend</span>
					<div className="next-to-container">
						<Frog sex="male" />
						<Frog sex="female" />
					</div>
				</div>
				<div className="actions">
					<span>Actions</span>
					<div className="next-to-container">
						<button disabled={!canFrogJump()} onClick={jump}>
							Jump
						</button>
						<button>Reproduce</button>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Board;
