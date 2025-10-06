import { WordResult } from "@/features/dictionary/types";

export type FavoritesScreenProps = {
	favorites: WordResult[];
	onRemove: (word: WordResult) => void;
};
