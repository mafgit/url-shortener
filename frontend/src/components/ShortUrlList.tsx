"use client";

import { ShortURL } from "@/types/ShortURL";
import { useState } from "react";
import { FaMinimize, FaArrowRight } from "react-icons/fa6";

function ShortUrlEntry({ entry }: { entry: ShortURL }) {
	const [clicks, setClicks] = useState(0);

	return (
		<div className="bg-white px-5 py-3 rounded-xl flex flex-col mt-4 gap-2 border-1 border-solid border-gray-600/20">
			<div className="flex gap-2 items-center justify-center">
				<div className="text-blue-800 cursor-pointer w-max bg-[#b9fff6] text-sm font-mono px-2 py-1 rounded-lg flex gap-2 items-center">
					<FaMinimize />
					<p className="underline  ">{entry.shortUrl}</p>
				</div>

				<FaArrowRight className="text-md" />

				<div className="text-blue-500 cursor-pointer bg-[#ffea8a] font-mono text-sm px-2 py-1 rounded-lg flex gap-2 items-center wrap-break-word">
					<p
						className="underline "
						onClick={() => {
							navigator.clipboard.writeText(entry.fullUrl);
							alert("Copied");
						}}
					>
						{entry.fullUrl}
					</p>
				</div>
			</div>
			<div className="w-full h-[1px] rounded-full mt-1 bg-gray-700/30"></div>
			<div className="flex justify-between gap-2 items-center">
				<p className="text-xs text-gray-700 text-center wrap-anywhere">
					📅 {entry.createdAt}
				</p>
				<p className="text-xs text-gray-700  wrap-anywhere">
					Expiry: {entry.expires}
				</p>

				<div className="flex gap-3 text-sm items-center justify-center">
					<p>🖱️ {clicks} Clicks</p>
					<button
						className="bg-[#1c1c1c] px-2 py-1 rounded-md text-white text-sm w-max cursor-pointer"
						onClick={async () => {
							const res = await fetch(
								process.env.NEXT_PUBLIC_BACKEND_URL +
									"/check-clicks/" +
									entry.shortUrl.split("/").slice(-1)[0],
							);

							if (!res.ok) {
								if (res.status === 403) {
									alert("You didn't create this short URL.");
								} else if (res.status === 400) {
									alert("URL is either invalid or expired");
								} else {
									alert("Unexpected Error");
									console.error(res);
								}

								return;
							}

							const { clicks } = await res.json();
							setClicks(clicks);
						}}
					>
						Recheck
					</button>
				</div>
			</div>
		</div>
	);
}

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
