import { DictionaryMode, WordResult } from "@/features/dictionary/types";

export type SearchScreenProps = {
	searchTerm: string;
	onChangeSearchTerm: (text: string) => void;
	onSubmit: () => void;
	loading: boolean;
	error: string | null;
	result: WordResult | null;
	examplesVisible: boolean;
	onToggleExamples: () => void;
	onToggleFavorite: (word: WordResult) => void;
	isCurrentFavorite: boolean;
	onPlayPronunciation: () => void;
	mode: DictionaryMode;
	onModeChange: (mode: DictionaryMode) => void;
};
