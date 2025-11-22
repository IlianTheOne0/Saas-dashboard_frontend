class Cache
{
	#map;

	constructor(timeToLive = 6 * 100)
	{
		if (Cache.instance) { return Cache.instance; }
		
		this.#map = new Map(); this.timeToLive = timeToLive;
		Cache.instance = this;
	}

	#set(key, value, timeToLive = null)
	{
		const now = Date.now();
		const timeToLiveInSeconds = timeToLive || this.timeToLive;
		const expire = (timeToLiveInSeconds === Infinity) ? Infinity : now + (timeToLiveInSeconds * 1000);
		this.#map.set(key, { value, expire });
	}
	#get(key)
	{
		const entry = this.#map.get(key);
		if (!entry) { return null; }
		if (Date.now() > entry.expire) { this.#map.delete(key); return null; }
		return entry.value;
	}

	setPermanent(key, value) { this.#set(key, value, Infinity); }
	set(key, value, timeToLive = null) { this.#set(key, value, timeToLive); }
	has(key) { return this.#get(key) !== null; }
	get(key) { return this.#get(key); }
	clear() { this.#map.clear(); }

	size() { return this.#map.size; }
}

export { Cache };