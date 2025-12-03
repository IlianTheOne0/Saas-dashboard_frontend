import { Outlet } from "react-router-dom";

import { useTheme } from "../../../hooks/useTheme";

import Aside from "./common/Aside/Aside";

import "../assets/styles/Layout.css";

function Layout()
{
	const { theme } = useTheme();

	return (
		<main className={`dashboard-layout ${theme}`}>
			<Aside/>

			<section className="main">
				<Outlet/>
			</section>
		</main>
	);
}

export default Layout;