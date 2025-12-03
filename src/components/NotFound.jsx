import { useTheme } from "../hooks/useTheme";

import "../assets/styles/components/NotFound.css";

function NotFound()
{
	const { theme } = useTheme();

	return (
		<section className={`not-found ${theme}`}>
			<h1 className="title">404 - Not Found</h1>
			<p className="subtitle">The page you are looking for does not exist</p>
		</section>
	);
}

export default NotFound;