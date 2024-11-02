import { useState } from "react";
import Field from "../Field/Field";
import Frog from "../Frog/Frog";
import "./index.css";

const Board = () => {
	const rows = 6;
	const cols = 10;
	const lake = [];
	const weightCharacteristics = ["slim", "fat"];
	const heightCharacteristics = ["tall", "short"];

	const [frogs, setFrogs] = useState([
		{
			sex: "male",
			row: 0,
			col: 0,
			characteristics: ["short", "slim"],
		},
		{
			sex: "female",
			row: 0,
			col: 1,
			characteristics: ["tall", "fat"],
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

		const checkedFrog = checkedFrogs[0];
		const fieldToJump = checkedIndexes.find(
			(el) => el.col !== checkedFrog?.col || el.row !== checkedFrog?.row
		);

		let distance = null;

		if (checkedFrog && fieldToJump) {
			// https://xlinux.nist.gov/dads/HTML/manhattanDistance.html
			distance =
				Math.abs(checkedFrog.col - fieldToJump.col) +
				Math.abs(checkedFrog.row - fieldToJump.row);
		}

		// We have only one forg checked and two checked fields - that means 2nd checked field is not a frog, so frog can jump there
		const checkedFieldsCondition =
			checkedFrogs.length === 1 && checkedIndexes.length === 2;

		const distanceCondition =
			checkedFrog?.sex === "female"
				? distance === 2 || distance === 4
				: distance === 3 || distance === 6;

		console.log(distance);

		return distanceCondition && checkedFieldsCondition;
	}

	function canFrogsReproduce() {
		const checkedFrogs = frogs.filter((frog) =>
			checkedIndexes.some(
				(cord) => frog.col === cord.col && frog.row === cord.row
			)
		);

		if (checkedFrogs.length !== 2) {
			return false;
		}

		const areFrogsDifferentSexes = checkedFrogs[0].sex !== checkedFrogs[1].sex;
		let areFrogsAdjacent = false;

		// Same column
		if (checkedFrogs[0].col === checkedFrogs[1].col) {
			if (Math.abs(checkedFrogs[0].row - checkedFrogs[1].row) === 1) {
				areFrogsAdjacent = true;
			}
		}

		// Same row
		if (checkedFrogs[0].row === checkedFrogs[1].row) {
			if (Math.abs(checkedFrogs[0].col - checkedFrogs[1].col) === 1) {
				areFrogsAdjacent = true;
			}
		}

		// Adjacent diagonally
		if (
			Math.abs(checkedFrogs[0].col - checkedFrogs[1].col) === 1 &&
			Math.abs(checkedFrogs[0].row - checkedFrogs[1].row) === 1
		) {
			areFrogsAdjacent = true;
		}

		return areFrogsAdjacent && areFrogsDifferentSexes;
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

	function getAvailableAdjacentPositions(frog) {
		const directions = [
			{ rowOffset: 0, colOffset: -1 }, // left
			{ rowOffset: -1, colOffset: -1 }, // top-left
			{ rowOffset: -1, colOffset: 0 }, // top
			{ rowOffset: -1, colOffset: 1 }, // top-right
			{ rowOffset: 0, colOffset: 1 }, // right
			{ rowOffset: 1, colOffset: 1 }, // bottom-right
			{ rowOffset: 1, colOffset: 0 }, // bottom
			{ rowOffset: 1, colOffset: -1 }, // bottom-left
		];

		const availablePositions = [];

		directions.forEach(({ rowOffset, colOffset }) => {
			const newRow = frog.row + rowOffset;
			const newCol = frog.col + colOffset;

			if (newRow >= 0 && newRow < rows && newCol >= 0 && newCol < cols) {
				const isOccupied = frogs.some(
					(existingFrog) =>
						existingFrog.row === newRow && existingFrog.col === newCol
				);

				if (!isOccupied) {
					availablePositions.push({ row: newRow, col: newCol });
				}
			}
		});

		return availablePositions;
	}

	function jump() {
		const frog = frogs.filter((frog) =>
			checkedIndexes.find(
				(cord) => frog.col === cord.col && frog.row === cord.row
			)
		)[0];

		const newFrogIndexes = checkedIndexes.find(
			(cord) => !(frog.col === cord.col && frog.row === cord.row)
		);

		if (newFrogIndexes) {
			const updatedFrogs = frogs.map((f) =>
				f.col === frog.col && f.row === frog.row
					? { ...f, col: newFrogIndexes.col, row: newFrogIndexes.row }
					: f
			);
			setFrogs(updatedFrogs);
			setCheckedIndexes([]);
		}
	}

	function reproduce() {
		const checkedFrogs = frogs.filter((frog) =>
			checkedIndexes.some(
				(cord) => frog.col === cord.col && frog.row === cord.row
			)
		);
		const randomNumber = Math.round(Math.random());
		const fromWhomInheritHeight = checkedFrogs[randomNumber];
		const fromWhomInheritWeight = checkedFrogs[1 - randomNumber];

		const babyCharacteristics = [
			fromWhomInheritHeight.characteristics.filter((char) =>
				heightCharacteristics.includes(char)
			)[0],
			fromWhomInheritWeight.characteristics.filter((char) =>
				weightCharacteristics.includes(char)
			)[0],
		];

		const baby = {
			characteristics: babyCharacteristics,
			sex: randomNumber === 0 ? "male" : "female",
		};

		const mother = checkedFrogs.find((frog) => frog.sex === "female");

		const availablePositions = getAvailableAdjacentPositions(mother);

		if (availablePositions.length > 0) {
			const newBabyPosition = availablePositions[0];
			baby.row = newBabyPosition.row;
			baby.col = newBabyPosition.col;

			setFrogs([...frogs, baby]);
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
						<button disabled={!canFrogsReproduce()} onClick={reproduce}>
							Reproduce
						</button>
					</div>
				</div>

				<div className="frogs">
					<span>Frogs summary</span>
					{(frogs || []).map((frog, index) => {
						return (
							<div key={index}>
								Frog - {index}: [{frog.characteristics.join()}]
							</div>
						);
					})}
				</div>
			</div>
		</div>
	);
};

export default Board;
