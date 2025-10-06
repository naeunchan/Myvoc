import { DictionaryMode } from "@/features/dictionary/types";

export type SettingsScreenProps = {
	mode: DictionaryMode;
	onModeChange: (mode: DictionaryMode) => void;
};
