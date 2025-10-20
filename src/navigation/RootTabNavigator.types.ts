import { DictionaryMode, WordResult } from "@/features/dictionary/types";
import { FavoriteWordEntry, MemorizationStatus } from "@/features/favorites/types";

export type RootTabNavigatorProps = {
	favorites: FavoriteWordEntry[];
	onToggleFavorite: (word: WordResult) => void;
	onUpdateFavoriteStatus: (word: string, status: MemorizationStatus) => void;
	onRemoveFavorite: (word: string) => void;
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
	onLogout: () => void;
	canLogout: boolean;
	isGuest: boolean;
	onRequestLogin: () => void;
	onRequestSignUp: () => void;
	onShowHelp: () => void;
};
