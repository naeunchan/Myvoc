import React, { useMemo } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { View } from "react-native";
import { HomeScreenProps } from "@/screens/Home/HomeScreen.types";
import { styles } from "@/screens/Home/HomeScreen.styles";
import { HomeHeader } from "@/screens/Home/components/HomeHeader";
import { SummaryCard } from "@/screens/Home/components/SummaryCard";
import { FavoritesList } from "@/screens/Home/components/FavoritesList";

export function HomeScreen({ favorites, lastSearchedWord, mode, onMoveToStatus, userName }: HomeScreenProps) {
	const { toMemorizeEntries, counts } = useMemo(() => {
		const summary = {
			toMemorize: 0,
			review: 0,
			mastered: 0,
		};
		const memorizeList: typeof favorites = [];

		for (const entry of favorites) {
			if (entry.status === "toMemorize") {
				memorizeList.push(entry);
				summary.toMemorize += 1;
			} else if (entry.status === "review") {
				summary.review += 1;
			} else if (entry.status === "mastered") {
				summary.mastered += 1;
			}
		}

		return { toMemorizeEntries: memorizeList, counts: summary };
	}, [favorites]);

	return (
		<SafeAreaView style={styles.safeArea}>
			<View style={styles.content}>
				<HomeHeader />
				<SummaryCard userName={userName} mode={mode} counts={counts} lastSearchedWord={lastSearchedWord} />
				<FavoritesList entries={toMemorizeEntries} emptyMessage="외울 단어장에 저장된 단어가 없어요." onMoveToReview={(word) => onMoveToStatus(word, "review")} />
			</View>
		</SafeAreaView>
	);
}
