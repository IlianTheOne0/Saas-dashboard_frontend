import { memo, useState, useEffect } from "react";

import { useUser } from "../../../../../hooks/useUser";

import DesktopHeader from "./DesktopHeader";
import MobileHeader from "./MobileHeader";

const Header = memo
(
	({ tabsData, asideData, activeTab, handleNavigation, handleToggleTheme, handleLogout, getIconUrl, theme }) =>
	{
		const { isLoading, getPersonalData } = useUser();
		const [userData,  setUserData] = useState({ Name: "", AvatarUrl: "" });

		useEffect
		(
			() =>
			{
				let isMounted = true;
				const fetchData = async () =>
				{
					const data = await getPersonalData();
					if (isMounted && data) { setUserData(data.data); }
				}
				fetchData();

				return () => { isMounted = false; }
			},
			[getPersonalData]
		);
		
		return (
			<>
				<DesktopHeader handleNavigation={handleNavigation} isLoading={isLoading} userData={userData} />
				<MobileHeader tabsData={tabsData} asideData={asideData} activeTab={activeTab} handleNavigation={handleNavigation} handleToggleTheme={handleToggleTheme} handleLogout={handleLogout} getIconUrl={getIconUrl} theme={theme}/>
			</>
		);
	}
);

export default Header;