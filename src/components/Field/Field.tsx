import "./index.css";
import Frog from "../Frog/Frog";
import { frogType } from "../../types";

const Field = ({
	frog,
	isChecked,
	col,
	row,
	isDisabled,
	setCheckedIndexes,
}: {
	frog?: frogType;
	isChecked: boolean;
	col: number;
	row: number;
	isDisabled: boolean;
	setCheckedIndexes: React.Dispatch<
		React.SetStateAction<{ col: number; row: number }[]>
	>;
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
				disabled={isDisabled}
			/>
			{frog && <Frog frog={frog} className="field__frog" />}
		</label>
	);
};

export default Field;
