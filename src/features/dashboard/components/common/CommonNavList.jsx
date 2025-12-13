import { useChat } from "../../../../hooks/store/useChat";

import CommonButtonWithIcon from "./CommonButtonWithIcon";

import "../../assets/styles/common/Aside/AsideNavList.css";

function CommonNavList({ className, tabs, asideData, activeTab, getIconUrl, handleNavigation, theme })
{
	const { unreadSenders } = useChat();

	const hasUnread = unreadSenders.length > 0;

	return (
		<nav className={`nav ${className}`}>
		{
			asideData.nav_items.items.map
			(
				(item) =>
				{
					const isChatIcon = item.iconName === "comment"; 
					const tab = tabs.find(tab => tab.id === item.id);

					return (
						<div key={item.id} className="nav-item-wrapper">
							<CommonButtonWithIcon className={activeTab === tab?.name ? "active" : ""} handler={() => handleNavigation(tab?.id)}>
								<img className="icon" src={getIconUrl(item.iconName, theme === "dark", activeTab === tab?.name, false)} alt={item.iconName}/>
							</CommonButtonWithIcon>
							
							{isChatIcon && hasUnread && <div className="notification-dot"></div>}
						</div>
					);
				}
			)
		}
		</nav>
	);
}

export default CommonNavList;