import { useState, useEffect } from "react";

import { useTheme } from "../../../hooks/useTheme";

import IconFullLight from "../../../assets/images/icons/logo/icon-full-light.svg"
import IconFullDark from "../../../assets/images/icons/logo/icon-full-dark.svg"
import IconFull from "../../../assets/images/icons/logo/icon-full.svg"

function Logo()
{
	const { theme } = useTheme();
	const [logo, setLogo] = useState(IconFull);

	useEffect
	(
		() =>
		{
			if (window.innerWidth <= 428) { setLogo(IconFull); return; }

			if (theme === "light") { setLogo(IconFullLight); }
			else if (theme === "dark") { setLogo(IconFullDark); }
			else { setLogo(IconFull); }
		},
		[theme]
	);

	return (
		<img className="icon-full" src={logo} alt="Icon"/>
	);
}

export default Logo;