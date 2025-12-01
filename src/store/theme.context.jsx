import { createContext, useCallback, useState } from "react";

import { cookies } from "../utils/cookies";

const ThemeContext = createContext(null);

function ThemeProvider({ children })
{
	const [theme, setTheme] = useState(cookies.get("theme") || "light");

	const toggleTheme = useCallback
	(
		() =>
		{
			const newTheme = theme === "light" ? "dark" : "light";
			setTheme(newTheme);
			cookies.set("theme", newTheme, { expires: 365 * 24 * 60 * 60 });
		},
		[theme]
	)

	const value = {theme, toggleTheme};
	return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export { ThemeContext, ThemeProvider };