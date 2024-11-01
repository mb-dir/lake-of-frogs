import "./index.css";
const Frog = ({ sex, className }: { sex: string; className?: string }) => {
	return (
		<div className={`frog ${className}`}>
			<div
				className={`frog__sex ${sex === "male" ? "frog__sex--male" : ""} ${
					sex === "female" ? "frog__sex--female" : ""
				}`}
			></div>
		</div>
	);
};

export default Frog;
