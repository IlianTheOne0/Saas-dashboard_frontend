const asideData = require("../../assets/data/aside.json");
const tabsData = require("../../assets/data/tabs.json").tabs;

import { useState, useEffect, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { useUser } from "../../../../hooks/useUser";

import DesktopAside from "./Aside/DesktopAside";
import MobileAside from "./Aside/MobileAside";
import Header from "./Header/Header";

const defaultNavPath = asideData.nav_items.paths.default_path;
const inactiveNavFolderAndDark = asideData.nav_items.paths.inactive_folder;
const activeNavFolder = asideData.nav_items.paths.active_folder;

const defaultBottomPath = asideData.bottom_items.paths.default_path;
const inactiveBottomFolderAndDark = asideData.bottom_items.paths.inactive_folder;
const activeBottomFolder = asideData.bottom_items.paths.active_folder;

function CommonWrapper({ theme, toggleTheme })
{
	const location = useLocation();
	const navigate = useNavigate();

	const { removeAccessToken } = useUser();

	const [activeTab, setActiveTab] = useState(() => { const path = location.pathname.split("/")[2]; return path || tabsData[0].name; });

	const getIconUrl = useCallback
	(
		(iconName, isDarkTheme, isActive, isBottom) =>
		{
			const basePath = isBottom ? defaultBottomPath : defaultNavPath;
			const activeFolder = isBottom ? activeBottomFolder : activeNavFolder;

			if (isDarkTheme === true) { return `${basePath}${activeFolder}${iconName}.svg`; }

			const inactiveFolder = isBottom ? inactiveBottomFolderAndDark : inactiveNavFolderAndDark;
			return isActive ? `${basePath}${activeFolder}${iconName}.svg` : `${basePath}${inactiveFolder}${iconName}.svg`;
		},
		[defaultBottomPath, defaultNavPath, activeBottomFolder, activeNavFolder, inactiveBottomFolderAndDark, inactiveNavFolderAndDark]
	);

	const handleToggleTheme = useCallback(() => { toggleTheme(); }, [toggleTheme]);
	const handleLogout = useCallback(() => { removeAccessToken(); }, [removeAccessToken]);

	const handleNavigation = useCallback((iconId) => { if (activeTab !== tabsData.find(tab => tab.id === iconId)?.name) { navigate(`/dashboard/${tabsData.find(tab => tab.id === iconId)?.name || ""}`); } }, [navigate, activeTab]);

	useEffect
	(
		() =>
		{
			let path = location.pathname.split("/")[2];
			setActiveTab(path || tabsData[0].name);
			if (!path) { handleNavigation(tabsData[0].id); return; }
		},
		[location]
	);
	
	return (
		<>
			<DesktopAside tabs={tabsData} asideData={asideData} activeTab={activeTab} getIconUrl={getIconUrl} handleNavigation={handleNavigation} handleToggleTheme={handleToggleTheme} handleLogout={handleLogout} theme={theme}/>
			<MobileAside tabs={tabsData} asideData={asideData} activeTab={activeTab} getIconUrl={getIconUrl} handleNavigation={handleNavigation} handleToggleTheme={handleToggleTheme} handleLogout={handleLogout} theme={theme}/>

			<Header asideData={asideData} tabsData={tabsData} activeTab={activeTab} handleNavigation={handleNavigation} handleToggleTheme={handleToggleTheme} handleLogout={handleLogout} getIconUrl={getIconUrl} theme={theme}/>
		</>
	);
}

export default CommonWrapper;