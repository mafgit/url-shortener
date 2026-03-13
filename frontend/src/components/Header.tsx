import { FaMinimize } from "react-icons/fa6";

export default function Header() {
	return (
		<div className="text-center flex flex-col gap-2">
			<h1 className="text-3xl font-extrabold flex gap-3 text-center flex-wrap items-center justify-center">
				<FaMinimize className="text-[#51b1ff]" />{" "}
				<span>URL Shortener</span>
			</h1>
			<p className="text-lg italic">Shorten long URLs with ease.</p>
		</div>
	);
}
