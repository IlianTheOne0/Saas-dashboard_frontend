import { Outlet } from "react-router-dom";

import { useTheme } from "../../../hooks/useTheme";

import Background from "./Background";

import "../assets/styles/AuthLayout.css";

function Layout()
{
	const { theme } = useTheme();

	return (
		<main className={`auth-layout ${theme}`}>
			<Background/>
			<section className="main">
				<Outlet/>
			</section>
		</main>
	);
}

export default Layout;