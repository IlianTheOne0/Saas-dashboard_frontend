import backgroundImage from "../assets/images/background.png";

import "../assets/styles/Background.css";

function Background()
{
	return <img className="background-img" src={backgroundImage} alt="Background"/>;
}

export default Background;