"use client";
import { ShortURL } from "@/types/ShortURL";
import { useState } from "react";
import { FaCopy, FaLink } from "react-icons/fa6";

interface Props {
	setShortUrls: React.Dispatch<React.SetStateAction<ShortURL[] | undefined>>;
}

export default function ShortenForm({ setShortUrls }: Props) {
	const [urlInput, setUrlInput] = useState("");
	const [shortUrl, setShortUrl] = useState("");
	const [disabled, setDisabled] = useState(false);
	const [expires, setExpires] = useState("never");

	const submitHandler = async (e: React.SubmitEvent) => {
		e.preventDefault();
		setShortUrl("");
		setDisabled(true);

		// setTimeout(async () => {

		try {
			new URL(urlInput); // testing url valid

			try {
				const res = await fetch(
					process.env.NEXT_PUBLIC_BACKEND_URL + "/shorten",
					{
						method: "POST",
						body: JSON.stringify({ url: urlInput, expires }),
						headers: {
							"Content-Type": "application/json",
						},
					},
				);

				if (!res.ok) {
					if (res.status === 429) {
						throw new Error(
							"Too many requests, please try again later.",
						);
					} else if (res.status === 500) {
						throw new Error(
							"Unexpected server error, please try again later.",
						);
					}
					throw new Error("HTTP Error " + res.status);
				}

				const { code } = await res.json();

				const finalShortUrl = window.location.origin + "/v/" + code;
				setShortUrl(finalShortUrl);

				// updating localstorage and list of short urls
				const shortUrlEntry: ShortURL = {
					shortUrl: finalShortUrl,
					createdAt: new Date().toLocaleString(),
					fullUrl: urlInput,
					expires: expires,
					clicks: 0,
				};
				try {
					localStorage.setItem(
						"shortUrls",
						JSON.stringify([
							shortUrlEntry,
							...JSON.parse(
								localStorage.getItem("shortUrls") || "[]",
							),
						]),
					);
				} catch {
					// localstorage was corrupted
					localStorage.setItem(
						"shortUrls",
						JSON.stringify([shortUrlEntry]),
					);
				}
				setShortUrls((prev) => {
					return [shortUrlEntry, ...(prev || [])];
				});
			} catch (e: unknown) {
				// console.error(e);
				if (e instanceof Error) {
					alert(e.message);
				}
			}
		} catch {
			alert("Please enter a valid URL");
		} finally {
			setDisabled(false);
		}
	};

	return (
		<div className="flex flex-col w-full max-w-125 gap-4 items-center justify-center text-center">
			<form
				onSubmit={submitHandler}
				className="flex w-full flex-col p-4 gap-4 items-center justify-center text-center bg-linear-to-br from-[#8eccff] to-[#4bf5bc] px-4 py-8 rounded-3xl"
			>
				<h2 className="text-xl font-bold text-black/85">
					Generate Short URL Now!
				</h2>
				<textarea
					id="url"
					spellCheck={false}
					// type="url"
					placeholder="Paste a long URL"
					className="w-full px-4 py-2 rounded-2xl bg-[#ffffffa6] text-sm resize-none overflow-hidden h-[42px] transition-[height] duration-300 focus:h-[100px] border-2 border-solid border-[#52a9ffa3] outline-none placeholder:text-black/60"
					required
					onChange={(e) => setUrlInput(e.target.value)}
				></textarea>
				<div className="flex items-center justify-between w-full gap-2">
					<button
						disabled={disabled}
						className="bg-[#1c1c1c] not-disabled:hover:bg-[#353535] font-semibold transition-all duration-300 cursor-pointer text-white disabled:opacity-50 disabled:cursor-not-allowed w-full px-4 py-2 rounded-xl flex gap-2 items-center justify-center"
					>
						<FaLink />
						<p>{disabled ? "Processing..." : "Shorten!"}</p>
					</button>

					<div className="flex flex-col  text-center bg-white p-1 rounded-md">
						<label htmlFor="expires" className="text-xs">
							Expires:
						</label>
						<select
							defaultValue={expires}
							onChange={(e) => setExpires(e.target.value)}
							id="expires"
							className="text-xs font-semibold rounded-md outline-none cursor-pointer"
						>
							<option value="never">Never</option>
							<option value="1 min">1 min</option>
							<option value="1 day">1 day</option>
							<option value="1 week">1 week</option>
							<option value="1 month">1 month</option>
							<option value="1 year">1 year</option>
						</select>
					</div>
				</div>

				<div
					className={
						"w-full text-center flex flex-col gap-2 items-center transition-all duration-300 " +
						(shortUrl
							? "opacity-100 translate-y-0 h-max pointer-events-auto"
							: "opacity-0 h-0 -translate-y-25 pointer-events-none")
					}
				>
					<h3 className="underline font-semibold text-black/85">
						Short URL:
					</h3>
					<div
						className="bg-[#ffffffc4] px-3 py-1 cursor-pointer hover:opacity-70 transition-all duration-300 rounded-full w-max flex gap-2 items-center justify-center"
						onClick={() => {
							navigator.clipboard.writeText(shortUrl);
							alert("Copied");
						}}
					>
						<p className="font-mono wrap-anywhere">{shortUrl}</p>
						<FaCopy className="text-sm" />
					</div>
				</div>
			</form>
		</div>
	);
}
