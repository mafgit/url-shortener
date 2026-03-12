"use client";
import { useState } from "react";
import { FaCopy, FaLink } from "react-icons/fa6";

export default function ShortenForm() {
	const [urlInput, setUrlInput] = useState("");
	const [shortUrl, setShortUrl] = useState("");
	const [disabled, setDisabled] = useState(false);

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
						body: JSON.stringify({ url: urlInput }),
						headers: {
							"Content-Type": "application/json",
						},
					},
				);

				if (!res.ok) {
					throw new Error("HTTP Error " + res.status);
				}

				const { code } = await res.json();
				setShortUrl(window.location.origin + "/v/" + code);
			} catch (e) {
				console.error(e);
				alert("An unexpected error occurred, please try again later.");
			}
		} catch {
			alert("Please enter a valid URL");
		} finally {
			setDisabled(false);
		}
	};

	return (
		<div className="flex flex-col  w-full max-w-125 gap-4 items-center justify-center text-center">
			<form
				onSubmit={submitHandler}
				className="flex w-full flex-col p-4 gap-4 items-center justify-center text-center bg-linear-to-br from-[#8eccff] to-[#4bf5bc] px-4 py-8 rounded-3xl"
			>
				<h2 className="text-xl font-bold text-black/85">
					Generate Short URL Now!
				</h2>
				<input
					placeholder="Paste a long URL"
					className="w-full px-4 py-2 rounded-2xl bg-[#ffffffa6] border-2 border-solid border-[#52a9ffa3] outline-none placeholder:text-black/60"
					required
					onChange={(e) => setUrlInput(e.target.value)}
				/>
				<button
					disabled={disabled}
					className="bg-[#1c1c1c] not-disabled:hover:bg-[#353535] font-semibold transition-all duration-300 cursor-pointer text-white disabled:opacity-50 disabled:cursor-not-allowed w-full px-4 py-2 rounded-xl flex gap-2 items-center justify-center"
				>
					<FaLink />
					<p>{disabled ? "Processing..." : "Shorten!"}</p>
				</button>

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
						className="bg-white px-2 py-1 cursor-pointer hover:opacity-70 transition-all duration-300 rounded-full w-max flex gap-2 items-center justify-center"
						onClick={() => {
							navigator.clipboard.writeText(shortUrl);
							alert("Copied");
						}}
					>
						<p className="w-max font-mono">{shortUrl}</p>
						<FaCopy className="text-sm" />
					</div>
				</div>
			</form>
		</div>
	);
}
