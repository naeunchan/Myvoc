export type DefinitionEntry = {
	definition: string;
	example?: string;
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
