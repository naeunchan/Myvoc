import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { View } from "react-native";
import { HomeScreenProps } from "@/screens/Home/HomeScreen.types";
import { styles } from "@/screens/Home/HomeScreen.styles";
import { HomeHeader } from "@/screens/Home/components/HomeHeader";
import { SummaryCard } from "@/screens/Home/components/SummaryCard";
import { FavoritesList } from "@/screens/Home/components/FavoritesList";

export function HomeScreen({
	favoritesCount,
	lastSearchedWord,
	mode,
	favorites,
	onRemoveFavorite,
	userName,
}: HomeScreenProps) {
	return (
		<SafeAreaView style={styles.safeArea}>
			<View style={styles.content}>
				<HomeHeader />
				<SummaryCard
					userName={userName}
					mode={mode}
					favoritesCount={favoritesCount}
					lastSearchedWord={lastSearchedWord}
				/>
				<FavoritesList favorites={favorites} onRemoveFavorite={onRemoveFavorite} />
			</View>
		</SafeAreaView>
	);
}
