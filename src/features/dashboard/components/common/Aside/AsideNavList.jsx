import "../../../assets/styles/common/Aside/AsideNavList.css";

import AsideCommonButton from "./AsideCommonButton";

function AsideNavList({ asideData, activeTab, getIconUrl, handleNavigation, theme })
{
	return (
		<nav className="nav">
		{
			asideData.nav_items.items.map
			(
				(item) =>
				(
					<AsideCommonButton className={activeTab === item.iconName ? "active" : ""} key={item.id} handler={() => handleNavigation(item.link)}>
						<img className="icon" src={getIconUrl(item.iconName, theme === "dark", activeTab === item.iconName, false)} alt={item.iconName}/>
					</AsideCommonButton>
				)
			)
		}
		</nav>
	);
}

export default AsideNavList;