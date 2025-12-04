import { Outlet } from "react-router-dom";

import { useTheme } from "../../../hooks/useTheme";

import CommonWrapper from "./common/CommonWrapper";

import "../assets/styles/Layout.css";

function Layout()
{
	const { theme, toggleTheme } = useTheme();

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