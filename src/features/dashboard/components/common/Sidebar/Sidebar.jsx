import "../../../assets/styles/common/Sidebar/Sidebar.css";

function Sidebar({ children, className })
{
	return (
		<section className={`sidebar ${className || ""}`}>
			<div className="indicator"></div>
			<aside className="content" onClick={(event) => event.stopPropagation()}>
				{children}
			</aside>
		</section>
	);
}

export default Sidebar;