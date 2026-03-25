"use client";
import { ShortURL } from "@/types/ShortURL";
import { copyToClipboard } from "@/utils/clipboard";
import {
	deleteEntryFromLocalStorage,
	updateClicksInLocalStorage,
} from "@/utils/localStorage";
import { useState } from "react";
import { FaArrowRight } from "react-icons/fa6";

export function ShortUrlEntry({ entry }: { entry: ShortURL }) {
	const [clicks, setClicks] = useState(entry.clicks || 0);
	const [disabled, setDisabled] = useState(false);
	const [showFullUrlFully, setShowFullUrlFully] = useState(false);

	async function checkClicksHandler() {
		setDisabled(true);

		try {
			const res = await fetch(
				process.env.NEXT_PUBLIC_BACKEND_URL +
					"/clicks/" +
					entry.shortUrl.split("/").slice(-1)[0],
			);

			if (!res.ok) {
				if (res.status === 429) {
					alert("Rate limit exceeded. Please try again later.");
				} else if (
					res.status === 403 ||
					res.status === 401 ||
					res.status === 400
				) {
					if (res.status === 403 || res.status === 401)
						alert("You didn't create this short URL.");
					else alert("URL is either invalid or expired");

					// delete from ls
					deleteEntryFromLocalStorage(entry);
				} else {
					alert("Unexpected Error");
					console.error(res);
				}

				return;
			}

			const { clicks } = await res.json();
			setClicks(clicks);

			updateClicksInLocalStorage(entry.shortUrl, clicks);
		} catch (e) {
			alert("Unexpected Error");
			console.error(e);
		} finally {
			setDisabled(false);
		}
	}

	return (
		<div className="bg-linear-to-br from-[#dddddd9e] to-[#9de9f7e8] px-5 py-3 rounded-xl flex flex-col mt-4 gap-2 border border-solid border-gray-600/20">
			<div className="flex gap-2 items-center justify-center flex-wrap">
				<div
					onClick={() => {
						copyToClipboard(entry.shortUrl);
					}}
					className="text-blue-800 justify-center flex-wrap cursor-pointer w-max border border-[#6cd5ffb7] bg-[#b9ebffb7] text-sm font-mono px-2 py-1 rounded-lg flex gap-2 items-center"
				>
					<p className="text-ellipsis wrap-anywhere">
						{entry.shortUrl}
					</p>
				</div>

				<FaArrowRight className="text-md" />

				<div className="text-blue-500 cursor-pointer bg-[#ffffffad] font-mono text-sm px-2 py-1 rounded-lg gap-2 items-center flex justify-center wrap-anywhere">
					<p
						// className={
						// 	showFullUrlFully
						// 		? ""
						// 		: "text-ellipsis max-h-[100px] overflow-hidden"
						// }
						className="inline mr-1 text-center"
						onClick={() => {
							copyToClipboard(entry.fullUrl)
							
						}}
					>
						{showFullUrlFully
							? entry.fullUrl
							: entry.fullUrl.slice(0, 50) + "..."}
						<span
							className="ml-1 font-sans text-xs bg-[#4b4b4b] text-[#e7e7e7] px-1.25 py-px hover:opacity-100 opacity-80 transition-opacity duration-300 rounded-sm text-nowrap"
							onClick={(e) => {
								e.stopPropagation();
								setShowFullUrlFully(!showFullUrlFully);
							}}
						>
							Show {showFullUrlFully ? " Less" : " Full"}
						</span>
					</p>
				</div>
			</div>
			<div className="w-full h-px rounded-full mt-1 bg-gray-700/30"></div>

			<div className="flex justify-center gap-x-8 gap-y-2 sm:gap-x-0 sm:justify-between items-center flex-wrap">
				<p className="text-xs text-gray-700 text-center wrap-anywhere">
					📅 {entry.createdAt}
				</p>

				<p className="text-xs text-gray-700  wrap-anywhere">
					Expiry: {entry.expires}
				</p>

				<div className="flex gap-2 text-xs items-center justify-center">
					<p className="text-gray-700">🖱️ {clicks} clicks</p>
					<button
						disabled={disabled}
						className="bg-[#1c1c1c] px-1.5 py-1 rounded-md disabled:opacity-50 disabled:cursor-not-allowed transition-opacity text-white text-xs w-max cursor-pointer"
						onClick={checkClicksHandler}
					>
						Recheck
					</button>
				</div>
			</div>
		</div>
	);
}
