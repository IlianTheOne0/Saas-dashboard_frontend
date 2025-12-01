import { createContext, useCallback, useState } from "react";
import { cookies } from "../utils/cookies";

const UserContext = createContext(null);

const SESSION_COOKIE_NAME = "user_session";

function UserProvider({ children })
{
	const [session, setSession] = useState
	(
		() => 
		{
			const cookieValue = cookies.get(SESSION_COOKIE_NAME);
			if (!cookieValue) { return null; }

			try { return JSON.parse(cookieValue); }
			catch { return null; }
		}
	);

	const saveSession = useCallback
	(
		(data) => 
		{
			setSession(data);
			cookies.set(SESSION_COOKIE_NAME, JSON.stringify(data), { expires: JSON.stringify(data).ExpiresIn || 3600 });
		},
		[]
	);

	const removeSession = useCallback
	(
		() => 
		{
			setSession(null);
			cookies.set(SESSION_COOKIE_NAME, "", { expires: -1 });
		},
		[]
	);

	const value = { session, saveSession, removeSession };

	return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

export { UserContext, UserProvider };