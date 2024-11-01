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
						<button>Jump</button>
						<button>Reproduce</button>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Board;
