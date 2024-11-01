import Field from "../Field/Field";
import Frog from "../Frog/Frog";
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
