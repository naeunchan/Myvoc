import { DictionaryMode, WordResult } from "@/components/dictionary/types";

export type SearchScreenProps = {
	searchTerm: string;
	onChangeSearchTerm: (text: string) => void;
	onSubmit: () => void;
	loading: boolean;
	error: string | null;
	result: WordResult | null;
	onToggleFavorite: (word: WordResult) => void;
	isCurrentFavorite: boolean;
	onPlayPronunciation: () => void;
	mode: DictionaryMode;
	onModeChange: (mode: DictionaryMode) => void;
};
