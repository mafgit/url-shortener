
import FormAndList from "@/components/FormAndList";
import Header from "@/components/Header";

export default function Home() {
	return (
		<div className="flex flex-col min-h-screen w-full py-12 px-2">
			<div className="flex flex-col items-center justify-center gap-8">
				<Header />

				<FormAndList />
			</div>

		</div>
	);
}
