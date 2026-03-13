"use client";
import { ShortURL } from "@/types/ShortURL";
import { useState } from "react";
import { FaMinimize, FaArrowRight } from "react-icons/fa6";

export function ShortUrlEntry({ entry }: { entry: ShortURL }) {
	const [clicks, setClicks] = useState(0);
	const [disabled, setDisabled] = useState(false);
	const [showFullUrlFully, setShowFullUrlFully] = useState(false);

	return (
		<div className="bg-white px-5 py-3 rounded-xl flex flex-col mt-4 gap-2 border border-solid border-gray-600/20">
			<div className="flex gap-2 items-center justify-center flex-wrap">
				<div
					onClick={() => {
						navigator.clipboard.writeText(entry.shortUrl);
						alert("Copied");
					}}
					className="text-blue-800 cursor-pointer w-max bg-[#b9fff6] text-sm font-mono px-2 py-1 rounded-lg flex gap-2 items-center"
				>
					<FaMinimize />
					<p className="">{entry.shortUrl}</p>
				</div>

				<FaArrowRight className="text-md" />

				<div className="text-blue-500 cursor-pointer bg-[#ffea8a] font-mono text-sm px-2 py-1 rounded-lg gap-2 items-center wrap-anywhere">
					<p
						// className={
						// 	showFullUrlFully
						// 		? ""
						// 		: "text-ellipsis max-h-[100px] overflow-hidden"
						// }
						className="inline mr-1"

						onClick={() => {
							navigator.clipboard.writeText(entry.fullUrl);
							alert("Copied");
						}}
					>
						{showFullUrlFully
							? entry.fullUrl
							: entry.fullUrl.slice(0, 100) + "..."}
					</p>
					<span
						className="font-sans text-xs bg-[#fff8d7] text-black px-1 rounded-sm text-nowrap"
						onClick={() => setShowFullUrlFully(!showFullUrlFully)}
					>
						Show {showFullUrlFully ? " Less" : " Full"}
					</span>
				</div>
			</div>
			<div className="w-full h-px rounded-full mt-1 bg-gray-700/30"></div>
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
						disabled={disabled}
						className="bg-[#1c1c1c] px-2 py-1 rounded-md disabled:opacity-50 disabled:cursor-not-allowed transition-opacity text-white text-sm w-max cursor-pointer"
						onClick={async () => {
							setDisabled(true);

							try {
								const res = await fetch(
									process.env.NEXT_PUBLIC_BACKEND_URL +
										"/clicks/" +
										entry.shortUrl.split("/").slice(-1)[0],
								);

								if (!res.ok) {
									if (res.status === 403) {
										alert(
											"You didn't create this short URL.",
										);
									} else if (res.status === 400) {
										alert(
											"URL is either invalid or expired",
										);
									} else {
										alert("Unexpected Error");
										console.error(res);
									}

									return;
								}

								const { clicks } = await res.json();
								setClicks(clicks);
							} catch (e) {
								alert("Unexpected Error");
								console.error(e);
							} finally {
								setDisabled(false);
							}
						}}
					>
						Recheck
					</button>
				</div>
			</div>
		</div>
	);
}
