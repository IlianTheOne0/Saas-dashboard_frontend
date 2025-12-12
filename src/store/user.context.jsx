import KAFKA_CONFIG from "../config/kafka.config";

import { createContext, useCallback, useEffect, useState, useRef, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";

import { useKafka } from "../hooks/services/useKafka";

import { cookies } from "../utils/cookies";
import { cache } from "../utils/cache";

const UserContext = createContext(null);

const ACCESS_TOKEN_COOKIE_NAME = "access_token";

const USER_DATA_CACHE_KEY = "user_personal_data";
const CONTACTS_CACHE_KEY = "user_contacts_data";

const MAX_RETRIES = 3;
const RETRY_DELAY_MS = 3000;
const REQUEST_TIMEOUT_MS = 8000;

function UserProvider({ children })
{
	const navigate = useNavigate();
	const location = useLocation();

	const userTopic = KAFKA_CONFIG.TOPICS_PRODUCER_NAMES.find(topic => topic.name === "user")?.topic;
	
	const { sendRequest } = useKafka();

	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState("");
	
	const [queue, setQueue] = useState([]);

	const isProcessingRef = useRef(false);

	const [accessToken, setAccessToken] = useState(() => cookies.get(ACCESS_TOKEN_COOKIE_NAME) || null);

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
			cache.clear();
		},
		[]
	);

	useEffect
	(
		() =>
		{
			if (!accessToken)
			{
				cache.clear();
				if (location.pathname.startsWith("/dashboard")) { navigate("/auth/login"); }
			}
		},
		[accessToken, location.pathname, navigate]
	);

	useEffect(() => { if (error) { const timer = setTimeout(() => clearErrors(), 5000); return () => clearTimeout(timer); } }, [error, clearErrors]);

	const defaultRequest = useCallback
	(
		(cache_key, topic, action, responseTopic, data = {}) =>
		{
			if (cache.has(cache_key)) { return { data: cache.get(cache_key) }; }
			
			return new Promise
			(
				(resolve, reject) =>
				{
					setQueue((previous) => [...previous, { topic, action, responseTopic, data, resolve, reject, }]);
				}
			);
		},
		[]
	);

	useEffect
	(
		() =>
		{
			const processQueue = async () =>
			{
				if (isProcessingRef.current || !queue || queue.length === 0) { return; }

				isProcessingRef.current = true;
				const currentTask = queue[0];

				let attempts = 0;
				let success = false;
				let lastError = null;

				while (attempts < MAX_RETRIES && !success)
				{
					try
					{
						setIsLoading(true);

						const payload = { clientId: KAFKA_CONFIG.CLIENT_ID, accessToken: accessToken, action: currentTask.action, ...currentTask.data };
						const result = await sendRequest(currentTask.action, { AccessToken: payload.accessToken }, currentTask.responseTopic, REQUEST_TIMEOUT_MS, currentTask.topic);

						currentTask.resolve(result);
						success = true;
					}
					catch (error)
					{
						lastError = error;
						attempts++;
						if (attempts < MAX_RETRIES) { await new Promise((retries) => setTimeout(retries, RETRY_DELAY_MS)); }
					}
				}

				if (!success)
				{
					const errorMessage = lastError?.message || "Unknown error occurred";
					setError(errorMessage);
					currentTask.reject(lastError);
				}

				setIsLoading(false);
				
				setQueue((previous) => (previous ? previous.slice(1) : []));
				isProcessingRef.current = false;
			};

			processQueue();
		},
		[queue, accessToken, sendRequest]
	);

	const getPersonalData = useCallback
	(
		async () =>
		{
			try
			{
				const result = await defaultRequest(USER_DATA_CACHE_KEY, userTopic, "get_personal_data", "get_personal_data-answer");
				if (result && result.data) { cache.set(USER_DATA_CACHE_KEY, result.data, 600); }
				return result;
			}
			catch { return null; }
		},
		[defaultRequest, userTopic]
	);

	const getAllContacts = useCallback
	(
		async () =>
		{
			try
			{
				const result = await defaultRequest(CONTACTS_CACHE_KEY, userTopic, "get_all_contacts", "get_all_contacts-answer");
				if (result && result.data) { cache.set(CONTACTS_CACHE_KEY, result.data, 600); }
				return result;
			}
			catch { return null; }
		},
		[defaultRequest, userTopic]
	);

	const starContact = useCallback
	(
		async (contactId) =>
		{
			return sendRequest("star_contact", { data: { ContactId: contactId }, AccessToken: accessToken }, "star_contact-answer", REQUEST_TIMEOUT_MS, userTopic);
		},
		[sendRequest, accessToken, userTopic]
	);

	const updateProfile = useCallback
	(
		async (profileData) =>
		{
			return sendRequest("update_profile", { ...profileData, AccessToken: accessToken }, "update_profile-answer", REQUEST_TIMEOUT_MS, userTopic);
		},
		[sendRequest, accessToken, userTopic]
	);

	const updateEmail = useCallback
	(
		async (newEmail) =>
		{
			return sendRequest("update_email", { NewEmail: newEmail, AccessToken: accessToken }, "update_email-answer", REQUEST_TIMEOUT_MS, userTopic);
		},
		[sendRequest, accessToken, userTopic]
	);

	const changePassword = useCallback
	(
		async (newPassword) =>
		{
			return sendRequest("change_password", { NewPassword: newPassword, AccessToken: accessToken }, "change_password-answer", REQUEST_TIMEOUT_MS, userTopic);
		},
		[sendRequest, accessToken, userTopic]
	);

	const uploadAvatar = useCallback
	(
		async (file) =>
		{
			return new Promise
			(
				(resolve, reject) =>
				{
					const reader = new FileReader();
					reader.readAsDataURL(file);
					reader.onload = async () =>
					{
						try
						{
							const base64Data = reader.result;
							const response = await sendRequest
							(
								"upload_avatar", 
								{ AccessToken: accessToken, Base64Image: base64Data, FileName: file.name }, 
								"upload_avatar-answer", REQUEST_TIMEOUT_MS + 5000, userTopic
							);
							resolve(response);
						}
						catch (error) { reject(error); }
					};
					reader.onerror = (error) => reject(error);
				}
			);
		},
		[sendRequest, accessToken, userTopic]
	);

	const deleteAvatar = useCallback
	(
		async () =>
		{
			return sendRequest("delete_avatar", { AccessToken: accessToken }, "delete_avatar-answer", REQUEST_TIMEOUT_MS, userTopic);
		},
		[sendRequest, accessToken, userTopic]
	);

	const value = useMemo
	(
		() => ({ accessToken, isLoading, saveAccessToken, removeAccessToken, getPersonalData, getAllContacts, starContact, updateProfile, updateEmail, changePassword, uploadAvatar, deleteAvatar, error, clearErrors, }),
		[accessToken, isLoading, saveAccessToken, removeAccessToken, getPersonalData, getAllContacts, updateProfile, updateEmail, changePassword]
	);

	return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

export { UserContext, UserProvider };