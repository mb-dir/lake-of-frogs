import "./index.css";
import Frog from "../Frog/Frog";

const Field = ({
	frog,
	isChecked,
	col,
	row,
	setCheckedIndexes,
}: {
	frog?: { sex: string };
	isChecked: boolean;
	col: number;
	row: number;
	setCheckedIndexes: (newIndexes: { col: number; row: number }[]) => void;
}) => {
	function toggleFrog({ target }: React.ChangeEvent<HTMLInputElement>) {
		if (target.checked) {
			setCheckedIndexes((prev) => [...prev, { col, row }]);
		} else {
			setCheckedIndexes((prev) =>
				prev.filter((el) => !(el.col === col && el.row === row))
			);
		}
	}

	return (
		<label className="field">
			<input
				type="checkbox"
				className="field__input"
				onChange={toggleFrog}
				checked={isChecked}
			/>
			{frog && <Frog sex={frog.sex} className="field__frog" />}
		</label>
	);
};

export default Field;
