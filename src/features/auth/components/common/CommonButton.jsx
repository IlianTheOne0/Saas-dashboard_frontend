import "../../assets/styles/common/CommonButton.css"

function CommonButton({ className, children, handler, type = "button", disabled = false })
{
	return (
		<button className={`common-button ${className}`} onClick={handler} type={type} disabled={disabled}>
			{children}
		</button>
	);
}

export default CommonButton;