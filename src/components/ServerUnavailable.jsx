import { useTheme } from "../hooks/useTheme";

import "../assets/styles/components/DefaultExceptionStyle.css";

function ServerUnavailable()
{
	const { theme } = useTheme();

	return (
		<section className={`exception-component ${theme}`}>
			<h1 className="title">503 - Server Unavailable</h1>
			<p className="subtitle">The server is currently unavailable. Please try again later.</p>
		</section>
	);
}

export default ServerUnavailable;