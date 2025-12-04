import CommonButtonWithIcon from "../CommonButtonWithIcon";

import CommonNavList from "../CommonNavList";

import IconBlue from "../../../assets/images/Aside/icon-blue.svg";

import "../../../assets/styles/common/Aside/DesktopAside.css";

function DesktopAside({ tabs, asideData, activeTab, getIconUrl, handleNavigation, handleToggleTheme, handleLogout, theme })
{
	return (
		<aside className="aside desktop-aside">
			<img className="logo" src={IconBlue} alt="Logo"/>

			<CommonNavList tabs={tabs} asideData={asideData} activeTab={activeTab} getIconUrl={getIconUrl} handleNavigation={handleNavigation} theme={theme}/>

			<div className="bottom-buttons">
				<CommonButtonWithIcon className={"aside-button bottom-button"} handler={() => handleToggleTheme()}>
					<img className="icon" key="sun" src={getIconUrl("sun", theme === "dark", false, true)} alt="Toggle Theme"/>
				</CommonButtonWithIcon>

				<CommonButtonWithIcon className={"aside-button bottom-button"} handler={() => handleLogout()}>
					<img className="icon" key="logout" src={getIconUrl("logout", theme === "dark", false, true)} alt="Logout"/>
				</CommonButtonWithIcon>
			</div>
		</aside>
	);
}

export default DesktopAside;