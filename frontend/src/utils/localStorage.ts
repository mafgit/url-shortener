import { ShortURL } from "@/types/ShortURL";

export function deleteEntryFromLocalStorage(entry: ShortURL) {
	const ls = JSON.parse(
		localStorage.getItem("shortUrls") || "[]",
	) as ShortURL[];
	localStorage.setItem(
		"shortUrls",
		JSON.stringify(ls.filter((item) => item.shortUrl !== entry.shortUrl)),
	);
}

export function updateClicksInLocalStorage(shortUrl: string, clicks: number) {
	try {
		const ls = JSON.parse(localStorage.getItem("shortUrls") || "[]");
		for (const e of ls) {
			if (e.shortUrl === shortUrl) {
				e.clicks = clicks;
				break;
			}
		}
		localStorage.setItem("shortUrls", JSON.stringify(ls));
	} catch (e) {
		console.error(e);
	}
}
