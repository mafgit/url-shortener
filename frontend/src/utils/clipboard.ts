export function copyToClipboard(text: string) {
	if (typeof window === "undefined") {
		return;
	}

	try {
		navigator.clipboard.writeText(text);
		alert("Copied");
	} catch {
		alert(
			"The connection is not secure (it is HTTP), so clipboard is blocked by the browser; copy manually please.",
		);
	}
}
