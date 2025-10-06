import { WordResult } from "@/features/dictionary/types";

export type FavoritesFlashcardProps = {
	favorites: WordResult[];
	onRemove: (word: WordResult) => void;
};
