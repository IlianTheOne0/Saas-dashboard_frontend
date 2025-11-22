import "../../assets/styles/common/CommonButton.css"

function CommonButton({ className, children, handler, type = "button" })
{
	return (
		<button className={`common-button ${className}`} onClick={handler} type={type}>
			{children}
		</button>
	);
}

export default CommonButton;