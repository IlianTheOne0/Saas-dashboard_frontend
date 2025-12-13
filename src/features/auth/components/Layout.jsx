import { useState, useEffect } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";

import { useTheme } from "../../../hooks/store/useTheme";
import { useUser } from "../../../hooks/store/useUser";

import Background from "./Background";

import "../assets/styles/Layout.css";
import "../assets/styles/common/Pages.css";

function Layout()
{
	const { theme } = useTheme();
	const { accessToken } = useUser();

	const navigate = useNavigate();
	const location = useLocation();

	const [locationClassName, setLocationClassName] = useState("");

	useEffect(() => { if (location.pathname === "/auth") { navigate("/auth/login", { replace: true }); } }, [location, navigate]);

	useEffect
	(
		() =>
		{
			const path = location.pathname;
			if (!path) { return; }

			switch (path)
			{
				case "/auth/login":	{ setLocationClassName("login"); } break;
				case "/auth/register": { setLocationClassName("register"); } break;
				case "/auth/recovery": { setLocationClassName("recovery"); } break;
				case "/auth/new-password": { setLocationClassName("new-password"); } break;
				case "/auth/confirmation": { setLocationClassName("confirmation"); } break;
				default: { setLocationClassName(""); } break;
			};

			if (path.includes("/auth/supabase-link"))
			{
				const paramsString = location.hash.length > 1 ? location.hash.substring(1) : location.search;
				
				const params = new URLSearchParams(paramsString);

				const error = params.get('error');
				const error_description = params.get('error_description');

				if (error) { navigate("/auth/login", { state: { error, error_description } }); return; }

				const type = params.get('type') || params.get('token_type');
				const access_token = params.get('access_token');
				const refresh_token = params.get('refresh_token');

				switch (type)
				{
					case "signup": { navigate("/auth/confirmation"); return; }
					case "recovery": { navigate("/auth/new-password", { state: { access_token, refresh_token } }); return; }
					default: { navigate("/auth/login", { state: { error: "Invalid Link", error_description: "The link type was not recognized." } }); return; }
				}
			}
		},
		[location, navigate]
	);

	useEffect(() => { if (accessToken) { navigate("/dashboard"); } }, [accessToken, navigate]);

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