"use client";
import { useState } from "react";

export default function ShortenForm() {
	const [urlInput, setUrlInput] = useState("");
	const [shortUrl, setShortUrl] = useState("");
    const [disabled, setDisabled] = useState(false)

	const submitHandler = async (e: React.SubmitEvent) => {
		e.preventDefault();
        setDisabled(true)

		try {
			new URL(urlInput); // testing url valid

            try {
                const res = await fetch("http://localhost:5000/shorten", {
                    method: "POST",
                    body: JSON.stringify({ url: urlInput }),
                    headers: {
                        'Content-Type': 'application/json',
                    }
                });

                if (!res.ok) {
                    throw new Error('HTTP Error ' + res.status)
                }
    
                const { code } = await res.json();
                setShortUrl("http://localhost:3000/v/" + code);
            } catch (e) {
                console.error(e);
                alert("An unexpected error occurred, please try again later.")
            }
        } catch {
			alert("Please enter a valid URL");
		} finally {
            setDisabled(false)
        }

	};

	return (
		<div className="flex flex-col px-4 py-8 bg-blue-400 max-w-[500px] gap-4 rounded-md items-center justify-center text-center">
			<form
				onSubmit={submitHandler}
				className="flex w-full flex-col p-4 gap-4 items-center justify-center text-center"
			>
				<h2>Generate Short URL!</h2>
				<input
                placeholder="Enter a URL"
					className="w-full px-4 py-2 bg-white rounded-md"
					required
					onChange={(e) => setUrlInput(e.target.value)}
				/>
				<button disabled={disabled} className="bg-[#1c1c1c] text-white w-full px-4 py-2 rounded-md">Shorten!</button>
			</form>

			{shortUrl && (
				<div className="w-full">
					<h3 className="underline">Short URL:</h3>
					<p>{shortUrl}</p>
				</div>
			)}
		</div>
	);
}
