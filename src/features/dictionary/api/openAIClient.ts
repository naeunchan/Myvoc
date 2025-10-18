import Constants from "expo-constants";
import OpenAI from "openai";
import { OPENAI_API_KEY } from "@env";

const OPENAI_MODEL = "gpt-4o";

type ExtraConfig = {
	openaiApiKey?: string;
};

function getOpenAIApiKey(): string {
	const inlineKey = typeof OPENAI_API_KEY === "string" ? OPENAI_API_KEY.trim() : "";
	if (inlineKey) {
		return inlineKey;
	}

	const envKey = (process.env.OPENAI_API_KEY ?? process.env.EXPO_PUBLIC_OPENAI_API_KEY)?.trim();
	if (envKey) {
		return envKey;
	}

	const extraKey = (Constants.expoConfig?.extra as ExtraConfig | undefined)?.openaiApiKey?.trim();
	if (extraKey) {
		return extraKey;
	}

	throw new Error("OpenAI API 키가 설정되어 있지 않아요.");
}

let cachedClient: OpenAI | null = null;

function getClient(): OpenAI {
	if (!cachedClient) {
		cachedClient = new OpenAI({
			apiKey: getOpenAIApiKey(),
			dangerouslyAllowBrowser: true,
		});
	}
	return cachedClient;
}

export async function callDictionaryModel(prompt: string): Promise<string> {
	const client = getClient();

	try {
		const completion = await client.chat.completions.create({
			model: OPENAI_MODEL,
			messages: [
				{
					role: "system",
					content: "You are a helpful dictionary assistant that only responds with valid JSON objects.",
				},
				{ role: "user", content: prompt },
			],
			temperature: 0.3,
			response_format: { type: "json_object" },
		});

		const content = completion.choices?.[0]?.message?.content;
		if (!content || typeof content !== "string") {
			throw new Error("사전 응답을 해석하지 못했어요.");
		}

		return content;
	} catch (error) {
		const status = (error as { status?: number })?.status;
		if (status === 429) {
			throw new Error("429 Error. 잠시 후 다시 시도해주세요.");
		}

		const message = (error as Error)?.message ?? "알 수 없는 오류가 발생했어요.";
		throw new Error(`사전 데이터를 가져오지 못했어요. ${message}`);
	}
}
