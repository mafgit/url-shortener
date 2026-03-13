"use client";

import { ShortURL } from "@/types/ShortURL";
import { ShortUrlEntry } from "./ShortUrlEntry";

export default function ShortUrlList({ shortUrls }: { shortUrls: ShortURL[] }) {
	return (
		<div className="max-w-150 w-full">
			<h2 className="text-xl font-bold text-center">
				Your Generated Short URLs
			</h2>
			<div className="flex flex-col gap-2">
				{shortUrls.length ? (
					shortUrls.map((entry) => (
						<ShortUrlEntry key={entry.shortUrl} entry={entry} />
					))
				) : (
					<p className="text-gray-500 text-center mt-2">
						No short URLs generated yet.
					</p>
				)}
			</div>
		</div>
	);
}
