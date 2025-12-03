import "../../../../assets/styles/common/Aside/mobile/MobileAside.css";
import AsideNavList from "../AsideNavList";

function MobileAside({ asideData, activeTab, getIconUrl, handleNavigation, theme })
{
	return (
		<aside className="aside mobile-aside">
			<AsideNavList asideData={asideData} activeTab={activeTab} getIconUrl={getIconUrl} handleNavigation={handleNavigation} theme={theme} />
		</aside>
	);
}

export default MobileAside;