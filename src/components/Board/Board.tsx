import { useState } from "react";
import Field from "../Field/Field";
import Frog from "../Frog/Frog";
import "./index.css";
import { frogType } from "../../types";

const Board = () => {
	const rows = 6;
	const cols = 10;
	const lake = [];
	const weightCharacteristics = ["slim", "fat"];
	const heightCharacteristics = ["tall", "short"];

	// Insteaed of one state for board fields there are two smaller states for checked fields and frogs - turned out to be bit more complex
	const [frogs, setFrogs] = useState<frogType[]>([
		{
			sex: "male",
			row: 0,
			col: 0,
			characteristics: ["short", "slim"],
			name: "frog 0",
			parents: [],
		},
		{
			sex: "female",
			row: 0,
			col: 1,
			characteristics: ["tall", "fat"],
			name: "frog 1",
			parents: [],
		},
	]);

	const [checkedIndexes, setCheckedIndexes] = useState<
		{ col: number; row: number }[]
	>([
		{ col: 0, row: 0 },
		{ col: 1, row: 0 },
	]);

	const areTwoFieldsChecked = checkedIndexes.length > 1;

	// Get all frogs which are on currently checked fields
	const checkedFrogs = frogs.filter((frog) =>
		checkedIndexes.some(
			(cord) => frog.col === cord.col && frog.row === cord.row
		)
	);

	// Get first frog
	const checkedFrog = checkedFrogs[0];

	function canFrogJump() {
		const fieldToJump = checkedIndexes.find(
			(el) => el.col !== checkedFrog?.col || el.row !== checkedFrog?.row
		);

		let distanceRow = 0;
		let distanceCol = 0;

		if (checkedFrog && fieldToJump) {
			// https://xlinux.nist.gov/dads/HTML/manhattanDistance.html
			distanceCol = Math.abs(checkedFrog.col - fieldToJump.col);
			distanceRow = Math.abs(checkedFrog.row - fieldToJump.row);
		}

		// We have only one forg checked and two checked fields - that means 2nd checked field is not a frog, so frog can jump there
		const checkedFieldsCondition =
			checkedFrogs.length === 1 && checkedIndexes.length === 2;

		function checkDistanceCondition(
			frog: frogType | null,
			distanceCol: number,
			distanceRow: number
		) {
			if (frog?.sex === "female") {
				// Condition for straight jump
				if (
					Math.abs(distanceCol - distanceRow) === 2 &&
					(distanceCol === 0 || distanceRow === 0)
				) {
					return true;
				}

				// Condition for diagonal jump
				if (distanceCol === distanceRow && distanceCol + distanceRow === 4) {
					return true;
				}
			} else if (frog?.sex === "male") {
				// Condition for straight jump
				if (
					Math.abs(distanceCol - distanceRow) === 3 &&
					(distanceCol === 0 || distanceRow === 0)
				) {
					return true;
				}

				// Condition for diagonal jump
				if (distanceCol === distanceRow && distanceCol + distanceRow === 6) {
					return true;
				}
			}

			return false;
		}

		const distanceCondition = checkDistanceCondition(
			checkedFrog,
			distanceCol,
			distanceRow
		);

		return distanceCondition && checkedFieldsCondition;
	}

	function canFrogsReproduce() {
		// Two frogs must be checked
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

	function getAvailableAdjacentPositions(frog: frogType) {
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

		const availablePositions: { row: number; col: number }[] = [];

		if (!frog) return availablePositions;

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
		// Find chekced field without frog on it
		const newFrogIndexes = checkedIndexes.find(
			(cord) => !(checkedFrog.col === cord.col && checkedFrog.row === cord.row)
		);

		if (newFrogIndexes) {
			// Change frog's coordinates
			const updatedFrogs = frogs.map((frog) =>
				frog.col === checkedFrog.col && frog.row === checkedFrog.row
					? { ...frog, col: newFrogIndexes.col, row: newFrogIndexes.row }
					: frog
			);
			setFrogs(updatedFrogs);
			setCheckedIndexes([]);
		}
	}

	function reproduce() {
		// Define which characteristic should be inherited from mother/father
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

		const baby: frogType = {
			characteristics: babyCharacteristics,
			sex: randomNumber === 0 ? "male" : "female",
			col: 0,
			row: 0,
			name: "",
			parents: [fromWhomInheritHeight.name, fromWhomInheritWeight.name],
		};

		const mother = checkedFrogs.find((frog) => frog.sex === "female");

		// Where child should be placed
		const availablePositions = getAvailableAdjacentPositions(mother!);

		if (availablePositions.length > 0) {
			// Placed new frog on the first available position
			const newBabyPosition = availablePositions[0];
			baby.row = newBabyPosition.row;
			baby.col = newBabyPosition.col;
			baby.name = `frog ${frogs.length}`;

			setFrogs((prev) => [...prev, baby]);
			setCheckedIndexes([]);
		} else {
			alert("There is no space around frog mother");
		}
	}

	// Generate grid elements
	for (let row = 0; row < rows; row++) {
		const rowFields = [];
		for (let col = 0; col < cols; col++) {
			const frog = frogs.find((el) => el.row === row && el.col === col);
			const isChecked = checkedIndexes.some(
				(el) => el.row === row && el.col === col
			);
			const isDisabled = areTwoFieldsChecked && !isChecked;

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
			<div className="board">
				<h2>Lake</h2>
				{lake}
			</div>
			<div className="description">
				<div className="legend">
					<span>Legend</span>
					<div className="next-to-container">
						<div>
							<Frog
								frog={{
									col: 0,
									row: 0,
									characteristics: [],
									parents: [],
									name: "",
									sex: "male",
								}}
							/>
							<span>male</span>
						</div>
						<div>
							<Frog
								frog={{
									col: 0,
									row: 0,
									characteristics: [],
									parents: [],
									name: "",
									sex: "female",
								}}
							/>
							<span>female</span>
						</div>
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
					<span>
						Frogs summary - extra section in order to visualize reproduction
						process
					</span>
					{(frogs || []).map((frog, index) => {
						return (
							<div key={index}>
								{frog.name}: [{frog.characteristics.join()}] - parents: [
								{frog.parents.join()}]
							</div>
						);
					})}
				</div>
			</div>
		</div>
	);
};

export default Board;
