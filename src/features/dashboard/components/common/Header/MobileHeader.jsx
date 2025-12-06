import AsideCommonButton from "../CommonButtonWithIcon";
import CommonNavList from "../CommonNavList";

import "../../../assets/styles/common/Header/MobileHeader.css";

function MobileHeader({ tabsData, asideData, activeTab, handleNavigation, handleToggleTheme, handleLogout, getIconUrl, theme })
{
	const mobileHeaderData =
	{
		...asideData,
		nav_items: { ...asideData.nav_items, items: asideData.nav_items.items.slice(-2) }
	};

	return (
		<header className="header mobile-header">
			<div className="buttons">
				<AsideCommonButton className={"aside-button bottom-button"} handler={() => handleToggleTheme()}>
					<img className="icon" key="sun" src={getIconUrl("sun", theme === "dark", false, true)} alt="Toggle Theme"/>
				</AsideCommonButton>

				<AsideCommonButton className={"aside-button bottom-button"} handler={() => handleLogout()}>
					<img className="icon" key="logout" src={getIconUrl("logout", theme === "dark", false, true)} alt="Logout"/>
				</AsideCommonButton>
			</div>

			<h3 className="tab-text">{activeTab?.toUpperCase() || ""}</h3>

			<CommonNavList className="buttons" tabs={tabsData} asideData={mobileHeaderData} activeTab={activeTab} getIconUrl={getIconUrl} handleNavigation={handleNavigation} theme={theme}/>
		</header>
	);
}

export default MobileHeader;