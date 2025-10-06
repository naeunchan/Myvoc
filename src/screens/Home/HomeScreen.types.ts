import { DictionaryMode, WordResult } from "@/features/dictionary/types";

export type HomeScreenProps = {
	favoritesCount: number;
	lastSearchedWord: string | null;
	mode: DictionaryMode;
	favorites: WordResult[];
	onRemoveFavorite: (word: WordResult) => void;
	userName: string;
};
