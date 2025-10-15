import React, { useCallback } from "react";
import { FlatList, Text, TouchableOpacity, View } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { WordResult } from "@/features/dictionary/types";
import { styles } from "@/screens/Home/HomeScreen.styles";

type FavoritesListProps = {
	favorites: WordResult[];
	onRemoveFavorite: (word: WordResult) => void;
};

function FavoriteItem({ item, onRemoveFavorite }: { item: WordResult; onRemoveFavorite: (word: WordResult) => void }) {
	const primaryDefinition = item.meanings[0]?.definitions[0]?.definition ?? "뜻 정보가 없어요.";

	return (
		<View style={styles.favoriteItem}>
			<View style={styles.favoriteItemText}>
				<Text style={styles.favoriteWord}>{item.word}</Text>
				<Text style={styles.favoriteDefinition}>{primaryDefinition}</Text>
			</View>
			<TouchableOpacity
				style={styles.favoriteRemoveButton}
				onPress={() => onRemoveFavorite(item)}
				accessibilityLabel={`${item.word} 삭제`}
			>
				<MaterialIcons name="delete-outline" size={22} color="#ef4444" />
			</TouchableOpacity>
		</View>
	);
}

export function FavoritesList({ favorites, onRemoveFavorite }: FavoritesListProps) {
	const hasFavorites = favorites.length > 0;

	const renderFavorite = useCallback(
		({ item }: { item: WordResult }) => (
			<FavoriteItem
				item={item}
				onRemoveFavorite={onRemoveFavorite}
			/>
		),
		[onRemoveFavorite],
	);

	const renderSeparator = useCallback(() => <View style={styles.favoriteSeparator} />, []);

	return (
		<View style={styles.favoriteCard}>
			<Text style={styles.cardTitle}>저장된 단어</Text>
			{hasFavorites ? (
				<FlatList
					data={favorites}
					renderItem={renderFavorite}
					keyExtractor={(item, index) => `${item.word}-${index}`}
					ItemSeparatorComponent={renderSeparator}
					contentContainerStyle={styles.favoriteListContent}
					showsVerticalScrollIndicator={false}
					style={styles.favoriteList}
				/>
			) : (
				<Text style={styles.emptyFavoriteText}>저장된 단어가 없어요.</Text>
			)}
		</View>
	);
}
