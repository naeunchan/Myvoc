import { Platform } from "react-native";

const WEB_PROXY_ENDPOINT = "https://api.allorigins.win/raw?url=";

function buildRequestUrl(url: string) {
	if (Platform.OS !== "web") {
		return url;
	}

	return `${WEB_PROXY_ENDPOINT}${encodeURIComponent(url)}`;
}

export async function fetchJson(input: string, init?: RequestInit) {
	const response = await fetch(buildRequestUrl(input), init);
	return response;
}
