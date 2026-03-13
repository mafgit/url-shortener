interface Props {
	params: {
		code: string;
	};
}

import { redirect } from "next/navigation";

// todo: fix double visit

export default async function Visit({ params }: Props) {
	const { code } = await params;

	try {
		const res = await fetch(
			process.env.NEXT_PUBLIC_BACKEND_URL + "/v/" + code,
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

		return <p>Error, this URL does not exist.</p>;
	}
}
