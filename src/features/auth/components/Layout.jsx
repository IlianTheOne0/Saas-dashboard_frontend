import { useState, useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";

import { useTheme } from "../../../hooks/useTheme";

import Background from "./Background";

import "../assets/styles/Layout.css";
import "../assets/styles/common/Pages.css";

function Layout()
{
	const { theme } = useTheme();
	const location = useLocation();

	const [locationClassName, setLocationClassName] = useState("");

	useEffect
	(
		() =>
		{
			const path = location.pathname;

			switch (path)
			{
				case "/auth/recovery": { setLocationClassName("recovery"); } break;
				case "/auth/register": { setLocationClassName("register"); } break;
				default: { setLocationClassName(""); } break;
			};
		},
		[location]
	)

	return (
		<main className={`auth-layout ${theme} ${locationClassName}`}>
			<Background/>
			<section className="main">
				<Outlet/>
			</section>
		</main>
	);
}

export default Layout;