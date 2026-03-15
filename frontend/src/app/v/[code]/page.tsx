interface Props {
	params: {
		code: string;
	};
}

import { redirect } from "next/navigation";
import { FaMinimize } from "react-icons/fa6";

// todo: fix double visit

export default async function Visit({ params }: Props) {
	const { code } = await params;

	try {
		const res = await fetch(
			process.env.INTERNAL_BACKEND_URL + "/v/" + code,
			{
				redirect: "manual", // stop before going to the url, to avoid double redirects,
				cache: "no-store", // to avoid stale effect due to next.js caching
			},
		);

		// console.log(res);
		if (res.status === 302) {
			const url = res.headers.get("location") as string;
			// console.log(url);
			redirect(url);
		} else {
			throw new Error("URL not found");
		}
	} catch (e: unknown) {
		// dont wanna catch this specific error otherwise redirect wouldnt take place, so rethrow it
		if (e instanceof Error && e.message === "NEXT_REDIRECT") throw e;

		return (
			<div className="text-center flex flex-col gap-2 min-h-screen items-center justify-center p-3">
				<h1 className="text-3xl font-extrabold flex gap-3 text-center flex-wrap items-center justify-center">
					<FaMinimize className="text-[#51b1ff]" />{" "}
					<span>URL Shortener</span>
				</h1>
				<p className="text-lg font-semibold text-red-600">
					Error: This URL does not exist.
				</p>
			</div>
		);
	}
}
