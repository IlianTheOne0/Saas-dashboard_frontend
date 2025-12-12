const tabsData = require("./assets/data/tabs.json");
import "../../assets/styles/CustomScrollbar.css";
import { useState, useMemo, useCallback, useRef, useLayoutEffect } from "react";

import SettingsSidebar from "./components/LeftBar";

import "./assets/styles/Settings.css";


function Settings()
{
	const [currentTab, setCurrentTab] = useState(tabsData.tabs[0].name);

	const contentRef = useRef(null);

	useLayoutEffect(() => { if (contentRef.current) { contentRef.current.scrollTop = 0; } }, [currentTab]);

	const getComponentName = (name) =>
	{
		switch (name.toLowerCase())
		{
			case "my account": { return "MyAccount"; }
			case "security & privacy": { return "Security"; }
			case "theme customization": { return "Theme"; }
			case "help": { return "Help"; }
			default: { return "MyAccount"; }
		}
	};

	const ActiveComponent = useMemo
		(
			() =>
			{
				try
				{
					const componentName = getComponentName(currentTab);
					return require(`./tabs/${componentName}/${componentName}`).default;
				}
				catch (error) 
				{
					console.warn(`Tab component for ${currentTab} not found.`);
					return () => <div className="settings-placeholder">Work in Progress: {currentTab.toUpperCase()}</div>; 
			}
		},
		[currentTab]
	);

	const handleTabChange = useCallback((tabName) => { setCurrentTab(tabName); }, []);

	return (
		<div className="settings-page"> 
			<div className="settings-layout">
				<SettingsSidebar tabs={tabsData.tabs} activeTab={currentTab} onTabChange={handleTabChange}/>

				<div className="settings-content-area custom-scrollbar" ref={contentRef}>
					{ActiveComponent ? <ActiveComponent/> : null}
				</div>
			</div>
		</div>
	);
}

export default Settings;