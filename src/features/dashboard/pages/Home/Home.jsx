const tabsData = require("./assets/data/tabs.json");

import { useState, useMemo, useCallback } from "react";

import TabSelector from "./components/TabSelector";

import "./assets/styles/Home.css";

function Home()
{
	const [currentTab, setCurrentTab] = useState(tabsData.tabs[0].name);
	const [isTabSelectorOpen, setIsTabSelectorOpen] = useState(false);

	const getComponentName = (name) => { return name.split(" ").map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(""); };
	const ActiveComponent = useMemo
	(
		() =>
		{
			try
			{
				const componentName = getComponentName(currentTab);
				return require(`./tabs/${componentName}/${componentName}`).default;
			}
			catch (error) { console.error(`Failed to load tab: ${currentTab}`, error); console.log(getComponentName(currentTab)); return () => <div>Error loading component</div>; }
		},
		[currentTab]
	);

	const handleTabClick = useCallback((tabName) => { setCurrentTab(tabName); setIsTabSelectorOpen(false); }, []);
	const handleTabSelectorToggle = useCallback(() => { setIsTabSelectorOpen((previous) => !previous); }, []);

	return (
		<div className="home">
			<TabSelector tabs={tabsData.tabs} currentTab={currentTab} onTabClick={handleTabClick} onSelectorToggle={handleTabSelectorToggle}isOpen={isTabSelectorOpen}/>
			<div className={`overlay ${isTabSelectorOpen ? "tab-selector-open" : ""}`} onClick={() => setIsTabSelectorOpen(false)}/>

			<div className="tab-body">
				{ActiveComponent ? <ActiveComponent isTabSelectorOpen={isTabSelectorOpen}/> : null}
			</div>
		</div>
	);
}

export default Home;