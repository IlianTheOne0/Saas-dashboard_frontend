class Cookies
{
	#cookies = {};

	constructor() { this.#parseCookies(); }

	#parseCookies()
	{
		this.#cookies = document.cookie
		.split("; ")
		.reduce
		(
			(accumulator, cookie) =>
			{
				const [name, value] = cookie.split("=");
				if (name) accumulator[name] = decodeURIComponent(value);
				return accumulator;
			},
			{}
		);
	}

	#get(name) { return this.#cookies[name]; }
	#set(name, value, options = {})
	{
		let cookieString = `${name}=${encodeURIComponent(value)}`;

		if (options.expires instanceof Date) { cookieString += `; expires=${options.expires.toUTCString()}`; }
		else if (typeof options.expires === "number")
		{
			const date = new Date();
			date.setTime(date.getTime() + options.expires * 1000);
			cookieString += `; expires=${date.toUTCString()}`;
		}

		document.cookie = cookieString;
		this.#cookies[name] = value;
	}

	get(name) { return this.#get(name); }
	set(name, value, options = {}) { this.#set(name, value, options); }
}

export const cookies = new Cookies();