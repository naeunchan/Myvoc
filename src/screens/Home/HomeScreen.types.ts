import { DictionaryMode } from "@/features/dictionary/types";
import { FavoriteWordEntry, MemorizationStatus } from "@/features/favorites/types";

export type HomeScreenProps = {
	favorites: FavoriteWordEntry[];
	lastSearchedWord: string | null;
	mode: DictionaryMode;
	onMoveToStatus: (word: string, status: MemorizationStatus) => void;
	userName: string;
	onPlayWordAudio: (word: FavoriteWordEntry["word"]) => void;
};
