import { memo } from "react";

import ArrowImage from "../assets/images/arrow_up-down.svg";

import "../assets/styles/TabSelector.css";

const TabSelector = memo
(
	({ tabs, currentTab, onTabClick, onSelectorToggle, isOpen }) =>
	{
		
		return (
			<div className={`custom-select-wrapper ${isOpen ? "open" : ""}`}>
				<div className="select-trigger" onClick={onSelectorToggle}>
					<span className="trigger-text">
						{currentTab.charAt(0).toUpperCase() + currentTab.slice(1)}
					</span>
					<div className="icon-container">
						<img src={ArrowImage} alt="Toggle Tabs" className="selector-icon"/>
					</div>
				</div>

				{
					isOpen &&
					(
						<div className="select-options">
							{
								tabs.map
								(
									(tab) =>
									(
										<div key={tab.id} className={`option ${currentTab === tab.name ? "selected" : ""}`} onClick={() => onTabClick(tab.name)}>
											{tab.name.charAt(0).toUpperCase() + tab.name.slice(1)}
										</div>
									)
								)
							}
						</div>
					)
				}
			</div>
		);
	}
);

export default TabSelector;