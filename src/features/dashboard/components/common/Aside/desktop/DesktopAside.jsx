import AsideCommonButton from "../AsideCommonButton";

import AsideNavList from "../AsideNavList";

import IconBlue from "../../../../assets/images/Aside/icon-blue.svg";

import "../../../../assets/styles/common/Aside/desktop/DesktopAside.css";

function DesktopAside({ asideData, activeTab, getIconUrl, handleNavigation, handleToggleTheme, handleLogout, theme })
{
	return (
		<aside className="aside desktop-aside">
			<img className="logo" src={IconBlue} alt="Logo"/>

			<AsideNavList asideData={asideData} activeTab={activeTab} getIconUrl={getIconUrl} handleNavigation={handleNavigation} theme={theme} />

			<div className="bottom-buttons">
				<AsideCommonButton className={"aside-button bottom-button"} handler={() => handleToggleTheme()}>
					<img className="icon" key="sun" src={getIconUrl("sun", theme === "dark", false, true)} alt="Toggle Theme"/>
				</AsideCommonButton>

				<AsideCommonButton className={"aside-button bottom-button"} handler={() => handleLogout()}>
					<img className="icon" key="logout" src={getIconUrl("logout", theme === "dark", false, true)} alt="Logout"/>
				</AsideCommonButton>
			</div>
		</aside>
	);
}

export default DesktopAside;