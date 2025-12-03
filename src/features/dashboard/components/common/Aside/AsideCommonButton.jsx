import "../../../assets/styles/common/Aside/AsideCommonButton.css"

function AsideCommonButton({ className, key, children, handler, type = "button", disabled = false })
{
	return (
		<button className={`aside-common-button ${className}`} key={key} onClick={handler} type={type} disabled={disabled}>
			{children}
		</button>
	);
}

export default AsideCommonButton;