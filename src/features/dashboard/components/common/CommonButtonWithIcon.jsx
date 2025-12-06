import "../../assets/styles/common/CommonButtonWithIcon.css";

function CommonButtonWithIcon({ className, children, handler, type = "button", disabled = false })
{
	return (
		<button className={`common-button-with-icon ${className}`} onClick={handler} type={type} disabled={disabled}>
			{children}
		</button>
	);
}

export default CommonButtonWithIcon;