import { useTheme } from "../hooks/store/useTheme";

import "../assets/styles/components/LoadingSpinner.css";

function LoadingSpinner({ message = "Loading...", size = "medium" }) 
{
	const { theme } = useTheme();

	return (
		<div className={`loading-spinner-wrapper ${theme} ${size}`}>
			<div className="spinner-ring">
				<div></div><div></div><div></div><div></div>
			</div>
			{message && <p className="loading-text">{message}</p>}
		</div>
	);
}

export default LoadingSpinner;