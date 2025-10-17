import { FavoriteWordEntry, MemorizationStatus } from "@/features/favorites/types";

export type FavoritesFlashcardProps = {
	entries: FavoriteWordEntry[];
	status: MemorizationStatus;
	onMoveToStatus: (word: string, status: MemorizationStatus) => void;
	onRemoveFavorite: (word: string) => void;
};
