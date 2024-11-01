import "./index.css";
const Frog = ({ sex }: { sex: string }) => {
	return (
		<div className="frog">
			<div
				className={`frog__sex ${sex === "male" ? "frog__sex--male" : ""} ${
					sex === "female" ? "frog__sex--female" : ""
				}`}
			></div>
		</div>
	);
};

export default Frog;
