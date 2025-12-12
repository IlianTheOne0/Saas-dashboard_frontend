import "../assets/styles/ThemeOption.css";

function ThemeOption({ label, mode, isActive, onClick })
{
	return (
		<div className={`theme-option ${isActive ? "active" : ""} ${mode}`} onClick={onClick}>
			<div className="preview-container">
				<div className="preview-sidebar"></div>
				<div className="preview-content">
					<div className="preview-header"></div>
					<div className="preview-card"></div>
					<div className="preview-card"></div>
				</div>

				{ isActive && (<div className="check-circle"><span>&#10003;</span></div>) }
			</div>
			<span className="theme-label">{label}</span>
		</div>
	);
}

export default ThemeOption;