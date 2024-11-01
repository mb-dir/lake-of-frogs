import Field from "../Field/Field";
import "./index.css";

const Board = () => {
	const rows = 6;
	const cols = 10;
	const lake = [];

	// Generate grid elements
	for (let row = 0; row < rows; row++) {
		const rowFields = [];
		for (let col = 0; col < cols; col++) {
			rowFields.push(<Field key={`${row}-${col}`} />);
		}
		lake.push(
			<div key={row} className="board-row">
				{rowFields}
			</div>
		);
	}
	return <div className="board">{lake}</div>;
};

export default Board;
