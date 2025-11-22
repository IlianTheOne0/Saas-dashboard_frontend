import { Outlet, useLocation } from "react-router-dom";

import { useTheme } from "../../../hooks/useTheme";

import Background from "./Background";

import "../assets/styles/AuthLayout.css";
import "../assets/styles/common/Pages.css";

function Layout()
{
	const { theme } = useTheme();
	const location = useLocation();

	const isRecoveryPage = location.pathname.includes("recovery");

	return (
		<main className={`auth-layout ${theme} ${isRecoveryPage ? "recovery" : ""}`}>
			<Background className={isRecoveryPage ? "recovery" : ""}/>
			<section className="main">
				<Outlet/>
			</section>
		</main>
	);
}

export default Layout;