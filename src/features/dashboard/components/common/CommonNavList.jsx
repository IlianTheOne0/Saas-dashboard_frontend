import CommonButtonWithIcon from "./CommonButtonWithIcon";

import "../../assets/styles/common/Aside/AsideNavList.css";

function CommonNavList({ className, tabs, asideData, activeTab, getIconUrl, handleNavigation, theme })
{
	return (
		<nav className={`nav ${className}`}>
		{
			asideData.nav_items.items.map
			(
				(item) =>
				(
					<CommonButtonWithIcon key={item.id} className={activeTab === tabs.find(tab => tab.id === item.id)?.name ? "active" : ""} handler={() => handleNavigation(tabs.find(tab => tab.id === item.id)?.id)}>
						<img className="icon" src={getIconUrl(item.iconName, theme === "dark", activeTab === tabs.find(tab => tab.id === item.id)?.name, false)} alt={item.iconName}/>
					</CommonButtonWithIcon>
				)
			)
		}
		</nav>
	);
}

export default CommonNavList;