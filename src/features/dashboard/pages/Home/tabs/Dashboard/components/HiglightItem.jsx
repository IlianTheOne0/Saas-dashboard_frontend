import { useTheme } from "../../../../../../../hooks/store/useTheme";

import "../assets/styles/HiglightItem.css";

function HiglightItem({ iconSrc, number, label, bckgColor, isIncrease = null, percentage })
{
	const { theme } = useTheme();

	return (
		<div className="card">
			<div className="top">
				<div className="icon-wrapper" style={{backgroundColor: `var(--${bckgColor}${theme === "light" ? "-C20" : "-C100"})`}}>
					<img className="icon" src={iconSrc} alt="Icon"/>
				</div>

				<div className="stats">
					{isIncrease !== null ? (isIncrease ? <div className="stats-icon increase">▲</div> : <div className="stats-icon decrease">▼</div>) : null}
					<p className="percentage">{percentage}</p>
				</div>
			</div>

			<p className="number">{number}</p>
			<p className="label">{label.split(" ").map(word => word.split('')[0].toUpperCase() + word.slice(1)).join(" ")}</p>
		</div>
	);
}

export default HiglightItem;