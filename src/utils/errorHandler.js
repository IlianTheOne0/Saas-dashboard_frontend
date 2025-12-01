function handleBackendError(error)
{
	const defaultMessage = "An unexpected error occurred during registration";

	if (!error || !error.message) { return defaultMessage; }

	let errorString = null;

	const delimiters =
	[
		"Registration failed and was rolled back:",
		"Failed to login the user:"
	];

	for (const delimiter of delimiters)
		{
		if (error.message.includes(delimiter))
		{
			const parts = error.message.split(delimiter);
			
			if (parts.length > 1) { errorString = parts[1].trim(); break; }
		}
	}

	if (!errorString) { return error.message; }

	try
	{
		const errorObj = JSON.parse(errorString);
		
		if (errorObj && errorObj.msg) { return errorObj.msg; }
		else { return defaultMessage; }
	}
	catch (error) { return errorString || defaultMessage; }
}

export { handleBackendError };