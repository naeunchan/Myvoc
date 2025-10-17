import React, { useMemo } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { View } from "react-native";
import { HomeScreenProps } from "@/screens/Home/HomeScreen.types";
import { styles } from "@/screens/Home/HomeScreen.styles";
import { HomeHeader } from "@/screens/Home/components/HomeHeader";
import { SummaryCard } from "@/screens/Home/components/SummaryCard";
import { FavoritesList } from "@/screens/Home/components/FavoritesList";

export function HomeScreen({ favorites, lastSearchedWord, mode, onMoveToStatus, onRemoveFavorite, userName }: HomeScreenProps) {
	const toMemorizeEntries = useMemo(() => favorites.filter((entry) => entry.status === "toMemorize"), [favorites]);
	const counts = useMemo(
		() => ({
			toMemorize: favorites.filter((entry) => entry.status === "toMemorize").length,
			review: favorites.filter((entry) => entry.status === "review").length,
			mastered: favorites.filter((entry) => entry.status === "mastered").length,
		}),
		[favorites],
	);

	return (
		<SafeAreaView style={styles.safeArea}>
			<View style={styles.content}>
				<HomeHeader />
				<SummaryCard userName={userName} mode={mode} counts={counts} lastSearchedWord={lastSearchedWord} />
				<FavoritesList
					entries={toMemorizeEntries}
					emptyMessage="외울 단어장에 저장된 단어가 없어요."
					onMoveToReview={(word) => onMoveToStatus(word, "review")}
				/>
			</View>
		</SafeAreaView>
	);
}
