export type DefinitionEntry = {
	definition: string;
	example?: string;
	originalDefinition?: string;
	pendingExample?: boolean;
	pendingTranslation?: boolean;
};

export type MeaningEntry = {
	partOfSpeech?: string;
	definitions: DefinitionEntry[];
};

export type WordResult = {
	word: string;
	phonetic?: string;
	audioUrl?: string;
	meanings: MeaningEntry[];
};

export type RawWordResult = Record<string, unknown> & {
	word?: unknown;
	phonetic?: unknown;
	audioUrl?: unknown;
	meanings?: unknown;
};
