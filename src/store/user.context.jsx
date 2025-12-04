import KAFKA_CONFIG from "../config/kafka.config";

import { createContext, useCallback, useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

import { useKafka } from "../hooks/services/useKafka";

import { cookies } from "../utils/cookies";
import { cache } from "../utils/cache";

const UserContext = createContext(null);

const ACCESS_TOKEN_COOKIE_NAME = "access_token";

function UserProvider({ children })
{
	const navigate = useNavigate();
	const location = useLocation();
	
	const { sendRequest, handleBackendError } = useKafka();

	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState("");
	
	const [accessToken, setAccessToken] = useState
	(
		() => 
		{
			const cookieValue = cookies.get(ACCESS_TOKEN_COOKIE_NAME);
            return cookieValue || null;
		}
	);

	const clearErrors = useCallback(() => { setError(""); }, []);
	
	const saveAccessToken = useCallback
	(
		(data) => 
		{
			setAccessToken(data);
			cookies.set(ACCESS_TOKEN_COOKIE_NAME, data, { expires: 3600 });
		},
		[]
	);

	const removeAccessToken = useCallback
	(
		() => 
		{
			setAccessToken(null);
			cookies.set(ACCESS_TOKEN_COOKIE_NAME, "", { expires: -1 });
		},
		[]
	);

	const getPersonalData = useCallback
	(
		async () =>
		{
			if (!accessToken) { return null; }
			if (cache.has("auth_user_data")) { return cache.get("auth_user_data"); }
			if (cache.has("personal_user_data")) { return cache.get("personal_user_data"); }

			if (isLoading) { return null; }
			setIsLoading(true);

			try
			{
				const response = await sendRequest("get_personal_data", { AccessToken: accessToken }, "get_personal_data-answer", 15000, KAFKA_CONFIG.TOPICS_PRODUCER_NAMES.find(topic => topic.name === "user")?.topic);
				if (response?.status.toLowerCase() === "success")
				{
					if (response.data) { cache.set("personal_user_data", response.data); }
					else { cache.set("personal_user_data", null); }
				}
				else { setError("Failed to fetch user data."); }
			}
			catch (error)
			{
				const processedError = handleBackendError(error);
				if (!processedError.includes("timed out")) { setError(processedError); }
			}
			finally { setIsLoading(false); }

			return cache.get("personal_user_data");
		},
		[accessToken, sendRequest, handleBackendError, isLoading]
	);

	useEffect(() => { if (!accessToken && location.pathname.startsWith("/dashboard")) { navigate("/auth/login"); } }, [accessToken]);
	useEffect(() => { if (error) { alert(error); clearErrors(); } }, [error, clearErrors]);

	const value = { accessToken, isLoading, saveAccessToken, removeAccessToken, getPersonalData };
	return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

export { UserContext, UserProvider };