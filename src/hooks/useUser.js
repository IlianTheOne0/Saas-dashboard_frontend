import { useContext } from "react";

import { UserContext } from "../store/user.context";

function useUser()
{
	const context = useContext(UserContext);

	if (!context) { throw new Error("useUser must be used within a UserProvider"); }
	return context;
}

export { useUser };