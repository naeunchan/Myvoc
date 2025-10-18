import { DictionaryMode, MeaningEntry, RawWordResult, WordResult } from "@/features/dictionary/types";
import { callDictionaryModel } from "@/features/dictionary/api/openAIClient";

function buildPrompt(term: string, mode: DictionaryMode): string {
	const baseInstruction = `Return a JSON object with keys: word (string), phonetic (string or null), audioUrl (string or null), meanings (array). For meanings include up to 2 items. Each meaning should have partOfSpeech (string or null) and definitions (array). Each definition must have definition (string) and example (string or null). Provide at most 2 example sentences per meaning.`;

	if (mode === "en-ko") {
		return `${baseInstruction}\nWord: ${term}\nDefinitions must be written in Korean. For each example sentence, write the English sentence followed by a Korean translation in parentheses. Do not include romanization in the definition. If phonetic is unknown, set it to null. audioUrl should always be null.`;
	}

	return `${baseInstruction}\nWord: ${term}\nProvide English definitions and English example sentences. If phonetic is unknown, set it to null. audioUrl should always be null.`;
}

const isRecord = (value: unknown): value is Record<string, unknown> => typeof value === "object" && value !== null;

const sanitizeDefinition = (definition: unknown): { definition: string; example?: string } | null => {
	if (!isRecord(definition)) {
		return null;
	}

	const text = typeof definition.definition === "string" ? definition.definition.trim() : "";
	if (!text) {
		return null;
	}

	const example = typeof definition.example === "string" && definition.example.trim() ? definition.example.trim() : undefined;
	return { definition: text, example };
};

function sanitizeMeanings(raw: unknown): MeaningEntry[] {
	if (!Array.isArray(raw)) {
		return [];
	}

	return raw
		.map((meaning) => {
			if (!isRecord(meaning)) {
				return null;
			}

			const partOfSpeech = typeof meaning.partOfSpeech === "string" ? meaning.partOfSpeech : undefined;
			const definitionsSource = Array.isArray(meaning.definitions) ? meaning.definitions : [];
			const definitions = definitionsSource.map(sanitizeDefinition).filter((entry): entry is { definition: string; example?: string } => entry !== null);

			if (definitions.length === 0) {
				return null;
			}

			const meaningEntry: MeaningEntry = {
				partOfSpeech,
				definitions,
			};

			return meaningEntry;
		})
		.filter((entry): entry is MeaningEntry => entry !== null);
}

function normalizeWordResult(raw: unknown, fallbackWord: string): WordResult {
	if (!isRecord(raw)) {
		throw new Error("사전 응답을 해석하지 못했어요.");
	}

	const rawResult = raw as RawWordResult;
	const word = typeof rawResult.word === "string" ? rawResult.word : fallbackWord;
	const phonetic = typeof rawResult.phonetic === "string" && rawResult.phonetic.trim() ? rawResult.phonetic.trim() : undefined;
	const audioUrl = typeof rawResult.audioUrl === "string" && rawResult.audioUrl.trim() ? rawResult.audioUrl.trim() : undefined;
	const meanings = sanitizeMeanings(rawResult.meanings);

	if (meanings.length === 0) {
		throw new Error("사전 정보를 찾을 수 없어요.");
	}

	return {
		word,
		phonetic,
		audioUrl,
		meanings,
	};
}

export async function getWordData(searchTerm: string, mode: DictionaryMode): Promise<WordResult> {
	const trimmed = searchTerm.trim().toLowerCase();
	if (!trimmed) {
		throw new Error("검색어를 입력해주세요.");
	}
	if (!/^[a-z\s'-]+$/.test(trimmed)) {
		throw new Error("영어 단어만 검색할 수 있어요.");
	}

	const prompt = buildPrompt(trimmed, mode);
	const content = await callDictionaryModel(prompt);

	let parsed: unknown;
	try {
		parsed = JSON.parse(content);
	} catch (error) {
		throw new Error("사전 응답 형식이 올바르지 않아요.");
	}

	return normalizeWordResult(parsed, trimmed);
}
