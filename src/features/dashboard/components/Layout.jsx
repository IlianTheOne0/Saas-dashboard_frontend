const tabsData = require("../assets/data/tabs.json").tabs;

import { useEffect } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";

import { useTheme } from "../../../hooks/useTheme";

import CommonWrapper from "./common/CommonWrapper";

import "../assets/styles/Layout.css";

function Layout()
{
	const location = useLocation();
	const navigate = useNavigate();

	const { theme, toggleTheme } = useTheme();

	useEffect(() => { if (location.pathname === "/dashboard") { navigate(`/dashboard/${tabsData[0].name}`, { replace: true }); } }, [location, navigate]);

	return (
		<main className={`dashboard-layout ${theme}`}>
			<section className="main">
				<CommonWrapper theme={theme} toggleTheme={toggleTheme}/>
				<Outlet/>
			</section>
		</main>
	);
}

export default Layout;