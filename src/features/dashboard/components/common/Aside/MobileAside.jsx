import CommonNavList from "../CommonNavList";

import "../../../assets/styles/common/Aside/MobileAside.css";

function MobileAside({ tabs, asideData, activeTab, getIconUrl, handleNavigation, theme })
{
	const mobileAsideData =
	{
		...asideData,
		nav_items: { ...asideData.nav_items, items: asideData.nav_items.items.slice(0, -2) }
	};

	return (
		<aside className="aside mobile-aside">
			<CommonNavList tabs={tabs} asideData={mobileAsideData} activeTab={activeTab} getIconUrl={getIconUrl} handleNavigation={handleNavigation} theme={theme}/>
		</aside>
	);
}

export default MobileAside;