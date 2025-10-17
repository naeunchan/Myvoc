import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { RootTabNavigator } from "@/navigation/RootTabNavigator";
import { DictionaryMode, WordResult } from "@/features/dictionary/types";
import { FavoriteWordEntry, MemorizationStatus } from "@/features/favorites/types";

type AppNavigatorProps = {
	favorites: FavoriteWordEntry[];
	onToggleFavorite: (word: WordResult) => void;
	onUpdateFavoriteStatus: (word: string, status: MemorizationStatus) => void;
	onRemoveFavorite: (word: string) => void;
	searchTerm: string;
	onChangeSearchTerm: (term: string) => void;
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
};

export function AppNavigator(props: AppNavigatorProps) {
	return (
		<NavigationContainer>
			<RootTabNavigator {...props} />
		</NavigationContainer>
	);
}
