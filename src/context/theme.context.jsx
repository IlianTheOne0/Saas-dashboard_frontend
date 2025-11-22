import { createContext, useState } from "react";

const ThemeContext = createContext(null);

function ThemeProvider({ children })
{
	const [theme, setTheme] = useState('light');

	const toggleTheme = () => {  setTheme((previous) => (previous === 'light' ? 'dark' : 'light')); };

	const value = {theme, toggleTheme};
	return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export { ThemeContext, ThemeProvider };