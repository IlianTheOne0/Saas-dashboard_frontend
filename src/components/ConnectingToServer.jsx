import { useTheme } from "../hooks/useTheme";


import "../assets/styles/components/DefaultExceptionStyle.css";

function ConnectingToServer()
{
	const { theme } = useTheme();
	
	return (
		<section className={`exception-component ${theme}`}>
			<h1 className="title">Connecting to the server...</h1>
			<p className="subtitle">Please wait while we establish a connection.</p>
		</section>
	);
}

export default ConnectingToServer;