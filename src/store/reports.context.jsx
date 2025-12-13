import KAFKA_CONFIG from "../config/kafka.config";

import { createContext, useCallback, useEffect, useState, useRef, useMemo } from "react";
import { useKafka } from "../hooks/services/useKafka";
import { cache } from "../utils/cache";

const ReportsContext = createContext(null);

const DASHBOARD_CACHE_KEY = "reports_home_dashboard";
const REALTIME_CACHE_KEY = "reports_home_realtime";
const AUDIENCE_CACHE_KEY = "reports_home_audience";
const TRAFFIC_CACHE_KEY = "reports_home_traffic";
const FAQS_CACHE_KEY = "reports_settings_faqs";

const REQUEST_TIMEOUT_MS = 8000;
const CACHE_TTL_SECONDS = 600;

function ReportsProvider({ children })
{
	const reportsTopic = KAFKA_CONFIG.TOPICS_PRODUCER_NAMES.find(topic => topic.name === "reports")?.topic;
	
	const { sendRequest } = useKafka();

	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState("");
	
	const [queue, setQueue] = useState([]);
	const isProcessingRef = useRef(false);

	const clearErrors = useCallback(() => { setError(""); }, []);
	
	const parseResponse = (data) => 
	{
		if (typeof data === 'string') 
		{
			try { return JSON.parse(data); } 
			catch (error) { console.error("Failed to parse report data", error); return null; }
		}
		return data;
	};

	const defaultRequest = useCallback
	(
		(cache_key, action, responseTopic) =>
		{
			if (cache.has(cache_key)) { return Promise.resolve({ data: cache.get(cache_key) }); }
			
			return new Promise
			(
				(resolve, reject) => { setQueue((previous) => [...previous, { action, responseTopic, resolve, reject, cache_key }]); }
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

				try
				{
					setIsLoading(true);

					if (cache.has(currentTask.cache_key))  { currentTask.resolve({ data: cache.get(currentTask.cache_key) }); }
					else
					{
						const result = await sendRequest(currentTask.action, {}, currentTask.responseTopic, REQUEST_TIMEOUT_MS, reportsTopic);
						const parsedData = parseResponse(result);
						
						if (parsedData) 
						{
							cache.set(currentTask.cache_key, parsedData, CACHE_TTL_SECONDS);
							currentTask.resolve({ data: parsedData });
						}
						else { throw new Error("Received empty or invalid data from reports service"); }
					}
				}
				catch (error)
				{
					console.error(`[ReportsContext] Error processing ${currentTask.action}:`, error);
					setError(error.message || "Failed to fetch report data");
					currentTask.reject(error);
				}
				finally
				{
					setIsLoading(false);
					setQueue((previous) => (previous ? previous.slice(1) : []));
					isProcessingRef.current = false;
				}
			};

			processQueue();
		},
		[queue, sendRequest, reportsTopic]
	);

	const getDashboardData = useCallback(() => defaultRequest(DASHBOARD_CACHE_KEY, "get_home_dashboard", "get_home_dashboard-answer"), [defaultRequest]);
	const getRealtimeData = useCallback(() => defaultRequest(REALTIME_CACHE_KEY, "get_home_realtime", "get_home_realtime-answer"), [defaultRequest]);
	const getAudienceData = useCallback(() => defaultRequest(AUDIENCE_CACHE_KEY, "get_home_audience", "get_home_audience-answer"), [defaultRequest]);
	const getTrafficSourceData = useCallback(() => defaultRequest(TRAFFIC_CACHE_KEY, "get_home_traffic-source", "get_home_traffic-source-answer"), [defaultRequest]);
	const getFaqsData = useCallback(() => defaultRequest(FAQS_CACHE_KEY, "get_settings_faqs", "get_settings_faqs-answer"), [defaultRequest]);

	const value = useMemo
	(
		() =>
		(
			{ isLoading, error, clearErrors, getDashboardData, getRealtimeData, getAudienceData, getTrafficSourceData, getFaqsData }
		),
		[isLoading, error, clearErrors, getDashboardData, getRealtimeData, getAudienceData, getTrafficSourceData, getFaqsData]
	);

	return <ReportsContext.Provider value={value}>{children}</ReportsContext.Provider>;
}

export { ReportsContext, ReportsProvider };