import "./index.css";
import { frogType } from "../../types";
const Frog = ({ frog, className }: { frog: frogType; className?: string }) => {
	return (
		<div className={`frog ${className}`}>
			<div
				className={`frog__sex ${frog.sex === "male" ? "frog__sex--male" : ""} ${
					frog.sex === "female" ? "frog__sex--female" : ""
				}`}
			></div>
			<div className="frog__name">{frog.name}</div>
		</div>
	);
};

export default Frog;
