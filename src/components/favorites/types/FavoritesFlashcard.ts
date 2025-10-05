import { WordResult } from "@/components/dictionary/types";

export type FavoritesFlashcardProps = {
	favorites: WordResult[];
	onRemove: (word: WordResult) => void;
};
