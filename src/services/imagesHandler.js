import { Cache } from "../utils/cache";

class ImagesHandler
{
	#cache;

	constructor()
	{
		if (ImagesHandler.instance) { return ImagesHandler.instance; }
		
		this.#cache = new Cache(60 * 60);

		ImagesHandler.instance = this;
	}

	async #fetchAndCacheImage(url)
	{
		try
		{
			const proxyUrl = "https://corsproxy.io/?url=";
			const absoluteUrl = proxyUrl + encodeURIComponent(url);

			const response = await fetch(absoluteUrl);
			if (!response.ok) { throw new Error(`Failed to fetch image: ${response.statusText}`); }

			const blob = await response.blob();
			const objectUrl = URL.createObjectURL(blob);

			this.#cache.set(url, objectUrl);

			return objectUrl;
		}
		catch (error) { throw error; }
	}

	async getImage(url)
	{
		try
		{
			if (!url) { throw new Error("Invalid URL"); }
			if (this.#cache.has(url)) { return this.#cache.get(url); }

			const imageUrl = await this.#fetchAndCacheImage(url);
			return imageUrl;
		}
		catch (error) { console.error("Error getting image:", error); return null; }
	}
}

export { ImagesHandler };