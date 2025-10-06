import { DictionaryMode, WordResult } from "@/features/dictionary/types";

export type RootTabNavigatorProps = {
	favorites: WordResult[];
	onToggleFavorite: (word: WordResult) => void;
	searchTerm: string;
	onChangeSearchTerm: (text: string) => void;
	onSubmitSearch: () => void;
	loading: boolean;
	error: string | null;
	result: WordResult | null;
	isCurrentFavorite: boolean;
	onPlayPronunciation: () => void;
	mode: DictionaryMode;
	onModeChange: (mode: DictionaryMode) => void;
	lastQuery: string | null;
	userName: string;
};
