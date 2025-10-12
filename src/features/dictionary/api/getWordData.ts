import { DictionaryMode, MeaningEntry, WordResult } from "@/features/dictionary/types";

const EN_EN_ENDPOINT = "https://api.dictionaryapi.dev/api/v2/entries/en";
const EN_KO_ENDPOINT = "https://glosbe.com/gapi/translate";
const EN_KO_FALLBACK_ENDPOINT = "https://api.mymemory.translated.net/get";

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
	async function fetchFromGlosbe(): Promise<WordResult | null> {
		try {
			const params = new URLSearchParams({
				from: "eng",
				dest: "kor",
				format: "json",
				phrase: trimmed,
				pretty: "true",
			});

			const response = await fetch(`${EN_KO_ENDPOINT}?${params.toString()}`);

			if (!response.ok) {
				return null;
			}

			type GlosbeMeaning = { language?: string; text?: string };
			type GlosbeEntry = {
				phrase?: { text?: string; language?: string };
				meanings?: GlosbeMeaning[];
			};
			const payload = (await response.json()) as {
				result?: string;
				tuc?: GlosbeEntry[];
			};

			if (payload.result && payload.result !== "ok") {
				return null;
			}

			const translations = new Set<string>();
			for (const entry of payload.tuc || []) {
				const phrase = entry.phrase?.text?.trim();
				if (phrase) {
					translations.add(phrase);
				}

				for (const meaning of entry.meanings || []) {
					if (meaning.language && !/^ko/.test(meaning.language)) {
						continue;
					}
					const text = meaning.text?.trim();
					if (text) {
						translations.add(text);
					}
				}
			}

			if (translations.size === 0) {
				return null;
			}

			const definitions = Array.from(translations).map((translation) => ({
				definition: decodeHtmlEntities(translation),
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
		} catch (error) {
			console.warn("Glosbe 번역 요청 실패:", error);
			return null;
		}
	}

	async function fetchFromMyMemory(): Promise<WordResult | null> {
		try {
			const params = new URLSearchParams({
				q: trimmed,
				langpair: "en|ko",
				mt: "1",
			});

			const response = await fetch(`${EN_KO_FALLBACK_ENDPOINT}?${params.toString()}`);
			if (!response.ok) {
				return null;
			}

			const payload = (await response.json()) as {
				responseData?: { translatedText?: string | null };
				matches?: Array<{ translation?: string | null; segment?: string | null }>;
			};

			const translations = new Set<string>();
			const primary = payload.responseData?.translatedText?.trim();
			if (primary) {
				translations.add(primary);
			}

			for (const match of payload.matches || []) {
				const text = match.translation?.trim();
				if (text) {
					translations.add(text);
				}
			}

			if (translations.size === 0) {
				return null;
			}

			const definitions = Array.from(translations).map((translation) => ({
				definition: decodeHtmlEntities(translation),
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
		} catch (error) {
			console.warn("MyMemory 번역 요청 실패:", error);
			return null;
		}
	}

	const primary = await fetchFromGlosbe();
	if (primary) {
		return primary;
	}

	const fallback = await fetchFromMyMemory();
	if (fallback) {
		return fallback;
	}

	throw new Error("번역을 불러오지 못했어요.");
}

export async function getWordData(searchTerm: string, mode: DictionaryMode): Promise<WordResult> {
	const trimmed = searchTerm.trim().toLowerCase();
	if (!trimmed) {
		throw new Error("검색어를 입력해주세요.");
	}
	if (!/^[a-z\s'-]+$/.test(trimmed)) {
		throw new Error("영어 단어만 검색할 수 있어요.");
	}

	switch (mode) {
		case "en-ko":
			return fetchEnglishKorean(trimmed);
		case "en-en":
		default:
			return fetchEnglishEnglish(trimmed);
	}
}
