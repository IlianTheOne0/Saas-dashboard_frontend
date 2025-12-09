const tabsData = require("./assets/data/tabs.json");

import { useState, useMemo } from "react";

import TabSelector from "./components/TabSelector";

function Home()
{
	const [currentTab, setCurrentTab] = useState(tabsData.tabs[0].name);

	const handleTabClick = (tabName) => { setCurrentTab(tabName); };

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

	return (
		<div className="home">
			<TabSelector tabs={tabsData.tabs} currentTab={currentTab} onTabClick={handleTabClick}/>
			
			<div className="tab-content">
				{`Current Tab: ${currentTab}`}
			</div>

			<div className="tab-body">
				{ActiveComponent ? <ActiveComponent /> : null}
			</div>
		</div>
	);
}

export default Home;