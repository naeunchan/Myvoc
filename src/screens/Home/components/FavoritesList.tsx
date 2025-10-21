import React, { useCallback } from "react";
import { FlatList, Text, TouchableOpacity, View } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { styles } from "@/screens/Home/HomeScreen.styles";
import { FavoriteWordEntry } from "@/features/favorites/types";

type FavoritesListProps = {
	entries: FavoriteWordEntry[];
	emptyMessage?: string;
	onMoveToReview: (word: string) => void;
	onPlayAudio: (word: FavoriteWordEntry["word"]) => void;
};

type FavoriteItemProps = {
	item: FavoriteWordEntry;
	onMoveToReview: (word: string) => void;
	onPlayAudio: (word: FavoriteWordEntry["word"]) => void;
};

function FavoriteItem({ item, onMoveToReview, onPlayAudio }: FavoriteItemProps) {
	const primaryDefinition = item.word.meanings[0]?.definitions[0]?.definition ?? "뜻 정보가 없어요.";
	const phonetic = item.word.phonetic;
	const hasAudio = Boolean(item.word.word?.trim());

	return (
		<View style={styles.favoriteItem}>
			<View style={styles.favoriteItemText}>
				<Text style={styles.favoriteWord}>{item.word.word}</Text>
				{phonetic ? <Text style={styles.favoritePhonetic}>{phonetic}</Text> : null}
				<Text style={styles.favoriteDefinition}>{primaryDefinition}</Text>
			</View>
			<View style={styles.favoriteActions}>
				{hasAudio ? (
					<TouchableOpacity
						style={styles.favoriteActionButton}
						onPress={() => onPlayAudio(item.word)}
						accessibilityLabel={`${item.word.word} 발음 듣기`}
					>
						<MaterialIcons name="volume-up" size={22} color="#2563eb" />
					</TouchableOpacity>
				) : null}
				<TouchableOpacity
					style={styles.favoriteActionButton}
					onPress={() => onMoveToReview(item.word.word)}
					accessibilityLabel={`${item.word.word} 복습으로 이동`}
				>
					<MaterialIcons name="playlist-add" size={22} color="#2563eb" />
				</TouchableOpacity>
			</View>
		</View>
	);
}

export function FavoritesList({ entries, emptyMessage = "저장된 단어가 없어요.", onMoveToReview, onPlayAudio }: FavoritesListProps) {
	const hasFavorites = entries.length > 0;

	const renderFavorite = useCallback(
		({ item }: { item: FavoriteWordEntry }) => (
			<FavoriteItem item={item} onMoveToReview={onMoveToReview} onPlayAudio={onPlayAudio} />
		),
		[onMoveToReview, onPlayAudio],
	);

	const renderSeparator = useCallback(() => <View style={styles.favoriteSeparator} />, []);

	return (
		<View style={styles.favoriteCard}>
			<Text style={styles.cardTitle}>외울 단어장</Text>
			{hasFavorites ? (
				<FlatList
					data={entries}
					renderItem={renderFavorite}
					keyExtractor={(item) => item.word.word}
					ItemSeparatorComponent={renderSeparator}
					contentContainerStyle={styles.favoriteListContent}
					showsVerticalScrollIndicator={false}
					style={styles.favoriteList}
				/>
			) : (
				<Text style={styles.emptyFavoriteText}>{emptyMessage}</Text>
			)}
		</View>
	);
}
