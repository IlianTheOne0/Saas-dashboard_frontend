import { memo } from "react";

import IconArrowRight from "../assets/images/arrow_up.svg";

import "../assets/styles/LeftBar.css";

const SettingsSidebar = memo
(
	({ tabs, activeTab, onTabChange }) => 
	{
		const getIcon = (iconName) =>
		{
			try { return require(`../assets/images/${iconName}`); }
			catch (error) { return null; } 
		};

		return (
			<div className="settings-sidebar">
				<div className="tabs-list">
					{
						tabs.map
						(
							(tab) =>
							(
								<button key={tab.id} className={`settings-tab-item ${activeTab === tab.name ? 'active' : ''}`} onClick={() => onTabChange(tab.name)} >
									<div className="left-content">
										<div className="icon-box">
											<img src={getIcon(tab.icon)} alt={tab.name} className="tab-icon"/>
										</div>
										<span className="tab-label">
											{tab.name.split(" ").map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(" ")}
										</span>
									</div>

									<img src={IconArrowRight} alt="Go" className="arrow-icon" style={{ transform: 'rotate(-90deg)' }}/>
								</button>
							)
						)
					}
				</div>
			</div>
		);
	});

export default SettingsSidebar;