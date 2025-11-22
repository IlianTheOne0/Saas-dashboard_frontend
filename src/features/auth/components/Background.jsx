import backgroundImage from "../assets/images/background.png";

import "../assets/styles/Background.css";

function Background({ className })
{
	return <img className={`background-img ${className}`} src={backgroundImage} alt="Background"/>;
}

export default Background;