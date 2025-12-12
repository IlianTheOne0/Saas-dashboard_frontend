import { useTheme } from "../../../../../../hooks/useTheme";

import ThemeOption from "./components/ThemeOption";

import "./assets/styles/Theme.css";

function Theme()
{
	const { theme, toggleTheme } = useTheme();

	const handleSelect = (selectedMode) => { if (theme !== selectedMode) { toggleTheme(); } };

	return (
		<div className="theme-tab">
			<h2 className="page-title">Appearance</h2>
			<p className="page-subtitle">Customize how the dashboard looks on your device.</p>

			<div className="theme-selection-grid">
				<ThemeOption label="Light Mode" mode="light" isActive={theme === "light"} onClick={() => handleSelect("light")}/>
				<ThemeOption label="Dark Mode" mode="dark" isActive={theme === "dark"} onClick={() => handleSelect("dark")}/>
			</div>
		</div>
	);
}

export default Theme;