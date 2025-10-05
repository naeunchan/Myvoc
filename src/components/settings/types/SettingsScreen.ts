import { DictionaryMode } from "@/components/dictionary/types";

export type SettingsScreenProps = {
	mode: DictionaryMode;
	onModeChange: (mode: DictionaryMode) => void;
};
