import ShortenForm from "@/components/ShortenForm";
import { FaMinimize } from "react-icons/fa6";

export default function Home() {
	return (
		<div className="flex flex-col min-h-screen w-full py-8 px-2">
			<div className="flex flex-col items-center justify-center gap-4">
				<div className="text-center flex flex-col gap-2">
					<h1 className="text-3xl font-extrabold flex gap-3 text-center flex-wrap items-center justify-center">
						<FaMinimize className="text-[#51b1ff]" />{" "}
						<span>URL Shortener</span>
					</h1>
					<p className="text-lg italic">
						Shorten long URLs with ease.
					</p>
				</div>

				<ShortenForm />
			</div>
		</div>
	);
}
