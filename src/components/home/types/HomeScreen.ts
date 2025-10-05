import { DictionaryMode } from "@/components/dictionary/types";

export type HomeScreenProps = {
	favoritesCount: number;
	lastSearchedWord: string | null;
	mode: DictionaryMode;
};
