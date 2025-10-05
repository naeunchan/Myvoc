import { DictionaryMode, MeaningEntry, WordResult } from "@/components/dictionary/types";

const EN_EN_ENDPOINT = "https://api.dictionaryapi.dev/api/v2/entries/en";
const EN_KO_ENDPOINT = "https://api.mymemory.translated.net/get";

function decodeHtmlEntities(value: string) {
	return value
		.replace(/&quot;/g, '"')
		.replace(/&#39;/g, "'")
		.replace(/&amp;/g, "&")
		.replace(/&lt;/g, "<")
		.replace(/&gt;/g, ">");
}

async function fetchEnglishEnglish(trimmed: string): Promise<WordResult> {
	const response = await fetch(`${EN_EN_ENDPOINT}/${encodeURIComponent(trimmed)}`);

	if (!response.ok) {
		throw new Error("단어를 찾을 수 없어요.");
	}

	const payload = (await response.json()) as Array<{
		word: string;
		phonetic?: string;
		phonetics?: Array<{ text?: string; audio?: string }>;
		meanings?: Array<{
			partOfSpeech?: string;
			definitions?: Array<{ definition: string; example?: string }>;
		}>;
	}>;

	const [entry] = payload;
	if (!entry) {
		throw new Error("단어 정보를 불러오지 못했어요.");
	}

	const phoneticText = entry.phonetic || entry.phonetics?.find((item) => item.text)?.text;
	const audioUrl = entry.phonetics?.find((item) => item.audio)?.audio;

	const meanings: MeaningEntry[] = (entry.meanings || []).map((meaning) => ({
		partOfSpeech: meaning.partOfSpeech,
		definitions: (meaning.definitions || []).map((definition) => ({
			definition: definition.definition,
			example: definition.example,
		})),
	}));

	return {
		word: entry.word,
		phonetic: phoneticText,
		audioUrl,
		meanings,
	};
}

async function fetchEnglishKorean(trimmed: string): Promise<WordResult> {
	const response = await fetch(`${EN_KO_ENDPOINT}?q=${encodeURIComponent(trimmed)}&langpair=en|ko`);

	if (!response.ok) {
		throw new Error("번역을 불러오지 못했어요.");
	}

	const payload = (await response.json()) as {
		responseData?: { translatedText?: string };
		matches?: Array<{ translation?: string }>;
	};

	const translations = new Set<string>();
	const primary = payload.responseData?.translatedText?.trim();
	if (primary) {
		translations.add(decodeHtmlEntities(primary));
	}
	for (const match of payload.matches || []) {
		const value = match.translation?.trim();
		if (value) {
			translations.add(decodeHtmlEntities(value));
		}
	}

	if (translations.size === 0) {
		throw new Error("번역을 찾을 수 없어요.");
	}

	const definitions = Array.from(translations).map((translation) => ({
		definition: translation,
	}));

	return {
		word: trimmed,
		meanings: [
			{
				partOfSpeech: "번역",
				definitions,
			},
		],
	};
}

export async function getWordData(searchTerm: string, mode: DictionaryMode): Promise<WordResult> {
	const trimmed = searchTerm.trim().toLowerCase();
	if (!trimmed) {
		throw new Error("검색어를 입력해주세요.");
	}

	switch (mode) {
		case "en-ko":
			return fetchEnglishKorean(trimmed);
		case "en-en":
		default:
			return fetchEnglishEnglish(trimmed);
	}
}
