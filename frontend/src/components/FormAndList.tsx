"use client";

import ShortUrlList from "@/components/ShortUrlList";
import ShortenForm from "@/components/ShortenForm";
import { ShortURL } from "@/types/ShortURL";
import { useEffect, useState } from "react";

export default function FormAndList() {
	const [shortUrls, setShortUrls] = useState<ShortURL[] | undefined>(
		undefined,
	);

	useEffect(() => {
		if (typeof window === "undefined") return;

		const local = localStorage.getItem("shortUrls");
		try {
			if (local) {
				// eslint-disable-next-line react-hooks/set-state-in-effect
				setShortUrls(JSON.parse(local));
			} else {
				setShortUrls([]);
			}
		} catch {
			localStorage.setItem("shortUrls", "[]");
			setShortUrls([]);
		}
	}, []);

	return (
		<main className="flex flex-col items-center justify-center gap-8 w-full">
			<ShortenForm setShortUrls={setShortUrls} />

			<ShortUrlList shortUrls={shortUrls} />
		</main>
	);
}
