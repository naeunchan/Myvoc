import { callDictionaryModel } from "@/features/dictionary/api/openAIClient";

const PHONETIC_PROMPT = (word: string) => `
Return a JSON object with a single key "phonetic".
- Use International Phonetic Alphabet (IPA) for the English word "${word}".
- Wrap the transcription in forward slashes (e.g., "/wɜːd/").
- If you cannot determine the phonetic transcription, set the value to null.
Do not include any additional keys or text.
`;

type PhoneticResponse = {
	phonetic?: unknown;
};

export async function getWordPhonetic(word: string): Promise<string | undefined> {
	const content = await callDictionaryModel(PHONETIC_PROMPT(word));

	let parsed: PhoneticResponse;
	try {
		parsed = JSON.parse(content) as PhoneticResponse;
	} catch (error) {
		throw new Error("발음 정보를 가져오지 못했어요.");
	}

	const phonetic = typeof parsed.phonetic === "string" ? parsed.phonetic.trim() : "";
	return phonetic || undefined;
}
