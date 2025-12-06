import "../../../assets/styles/common/Sidebar/DesktopSidebar.css";

function CommonSidebar({ children })
{
	return (
		<section className="common-sidebar">
			<div className="indicator"></div>
			<aside className="content">{children}</aside>
		</section>
	);
}

export default CommonSidebar;