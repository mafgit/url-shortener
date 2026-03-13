"use client";

import ShortUrlList from "@/components/ShortUrlList";
import ShortenForm from "@/components/ShortenForm";
import { ShortURL } from "@/types/ShortURL";
import { useEffect, useState } from "react";

export default function FormAndList() {
	const [shortUrls, setShortUrls] = useState<ShortURL[]>([]);
	useEffect(() => {
        if (typeof window === "undefined") return;
        
		const local = localStorage.getItem("shortUrls");
		if (local) {
			try {
				// eslint-disable-next-line react-hooks/set-state-in-effect
				setShortUrls(JSON.parse(local));
			} catch {
				localStorage.setItem("shortUrls", "[]");
			}
		}
	}, []);

	return (
		<div className="flex flex-col items-center justify-center gap-8 w-full">
			<ShortenForm setShortUrls={setShortUrls} />

			<ShortUrlList shortUrls={shortUrls} />
		</div>
	);
}
