import { WordResult } from "@/components/dictionary/types";

export type FavoritesScreenProps = {
	favorites: WordResult[];
	onRemove: (word: WordResult) => void;
};
