import React, { useMemo } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Text, View } from "react-native";
import { FavoritesFlashcard } from "@/components/favorites/components/FavoritesFlashcard";
import { FavoritesScreenProps } from "@/components/favorites/types/FavoritesScreen";
import { styles } from "@/components/favorites/styles/FavoritesScreen.styles";

export function FavoritesScreen({ favorites, onRemove }: FavoritesScreenProps) {
	const hasFavorites = useMemo(() => favorites.length > 0, [favorites]);

	return (
		<SafeAreaView style={styles.safeArea}>
			<View style={styles.content}>
				<Text style={styles.title}>내 단어장</Text>
				{hasFavorites ? (
					<FavoritesFlashcard favorites={favorites} onRemove={onRemove} />
				) : (
					<Text style={styles.emptyText}>저장된 단어가 없어요.</Text>
				)}
			</View>
		</SafeAreaView>
	);
}
