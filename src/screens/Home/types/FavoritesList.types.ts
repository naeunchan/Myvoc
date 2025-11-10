import { FavoriteWordEntry } from "@/features/favorites/types";

export type FavoritesListProps = {
	entries: FavoriteWordEntry[];
	emptyMessage?: string;
	onMoveToReview: (word: string) => void;
	onPlayAudio: (word: FavoriteWordEntry["word"]) => void;
};

export type FavoriteItemProps = {
	item: FavoriteWordEntry;
	onMoveToReview: (word: string) => void;
	onPlayAudio: (word: FavoriteWordEntry["word"]) => void;
};
