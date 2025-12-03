import asideData from "../../../assets/data/aside.json"

import { useState, useCallback, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { useTheme } from "../../../../../hooks/useTheme";

import DesktopAside from "./desktop/DesktopAside";
import MobileAside from "./mobile/MobileAside";

const defaultNavPath = asideData.nav_items.paths.default_path;
const inactiveNavFolderAndDark = asideData.nav_items.paths.inactive_folder;
const activeNavFolder = asideData.nav_items.paths.active_folder;

const defaultBottomPath = asideData.bottom_items.paths.default_path;
const inactiveBottomFolderAndDark = asideData.bottom_items.paths.inactive_folder;
const activeBottomFolder = asideData.bottom_items.paths.active_folder;

const tabs = asideData.nav_items.items;

function Aside()
{
	const location = useLocation();
	const navigate = useNavigate();

	const { theme, toggleTheme } = useTheme();

	const [activeTab, setActiveTab] = useState(null);

	const getIconUrl = (iconName, isDarkTheme, isActive, isBottom) =>
	{
		const basePath = isBottom ? defaultBottomPath : defaultNavPath;
		const activeFolder = isBottom ? activeBottomFolder : activeNavFolder;

		if (isDarkTheme === true) { return `${basePath}${activeFolder}${iconName}.svg`; }

		const inactiveFolder = isBottom ? inactiveBottomFolderAndDark : inactiveNavFolderAndDark;
		return isActive ? `${basePath}${activeFolder}${iconName}.svg` : `${basePath}${inactiveFolder}${iconName}.svg`;
	}

	const handleNavigation = useCallback((link) => { if (activeTab !== link) { navigate(`/dashboard${link}`); } }, [navigate, activeTab]);
	const handleToggleTheme = useCallback(() => { toggleTheme(); }, [toggleTheme]);
	const handleLogout = useCallback(() => { return null; }, []);

	useEffect
	(
		() =>
		{
			let path = location.pathname.split("/")[2];
			setActiveTab(path || tabs[0].iconName);
			if (!path) { handleNavigation(tabs[0].link); return; }
		},
		[location]
	);

	return (
		<>
			<DesktopAside asideData={asideData} activeTab={activeTab} getIconUrl={getIconUrl} handleNavigation={handleNavigation} handleToggleTheme={handleToggleTheme} handleLogout={handleLogout} theme={theme} />
			<MobileAside asideData={asideData} activeTab={activeTab} getIconUrl={getIconUrl} handleNavigation={handleNavigation} handleToggleTheme={handleToggleTheme} handleLogout={handleLogout} theme={theme} />
		</>
	);
}

export default Aside;