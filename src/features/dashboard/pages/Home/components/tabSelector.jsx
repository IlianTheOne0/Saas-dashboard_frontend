import { memo } from "react";

const TabSelector = memo
(
	({ tabs, currentTab, onTabClick }) =>
	{
		return (
			<div className="tab-selector">
				{
					tabs.map
					(
						(tab) =>
						(
							<button key={tab.id} className={`tab-button ${currentTab === tab.name ? "active" : ""}`} onClick={() => onTabClick(tab.name)}>
								{tab.name.charAt(0).toUpperCase() + tab.name.slice(1)}
							</button>
						)
					)
				}
			</div>
		);
	}
);

export default TabSelector;