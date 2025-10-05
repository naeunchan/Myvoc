export type DictionaryMode = "en-en" | "en-ko";

export type DictionaryModeToggleProps = {
	mode: DictionaryMode;
	onChange: (mode: DictionaryMode) => void;
};
