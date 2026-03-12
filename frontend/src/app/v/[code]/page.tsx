interface Props {
	params: {
		code: string;
	};
}

import { redirect } from "next/navigation";

export default async function Visit({ params }: Props) {
	const { code } = await params;

	try {
		const res = await fetch("http://backend-container:5000/v/" + code, {
			redirect: "manual", // stop before going to the url, to avoid double redirects,
			cache: "no-store", // to avoid stale effect due to next.js caching
		});

		console.log(res);
		if (res.status >= 300 && res.status < 400) {
			const url = res.headers.get("location") as string;
			console.log(url);
			redirect(url);
		} else {
			throw new Error("URL not found")
		}
	} catch (e: any) {
		// dont wanna catch this specific error otherwise redirect wouldnt take place, so rethrow it
		if (e.message === "NEXT_REDIRECT") throw e;

		return <p>Error, this URL does not exist.</p>;
	}
}
