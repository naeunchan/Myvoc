import React, { useCallback } from "react";
import { FlatList, Text, TouchableOpacity, View } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { FAVORITES_LIST_TEXT } from "@/screens/Home/constants";
import { styles } from "@/screens/Home/styles/FavoritesList.styles";
import { FavoriteItemProps, FavoritesListProps } from "@/screens/Home/types/FavoritesList.types";

function FavoriteItem({ item, onMoveToReview, onPlayAudio }: FavoriteItemProps) {
	const primaryDefinition = item.word.meanings[0]?.definitions[0]?.definition ?? "뜻 정보가 없어요.";
	const phonetic = item.word.phonetic;
	const hasAudio = Boolean(item.word.word?.trim());

	return (
		<View style={styles.itemRow}>
			<View style={styles.itemText}>
				<Text style={styles.word}>{item.word.word}</Text>
				{phonetic ? <Text style={styles.phonetic}>{phonetic}</Text> : null}
				<Text style={styles.definition}>{primaryDefinition}</Text>
			</View>
			<View style={styles.actions}>
				{hasAudio ? (
					<TouchableOpacity
						style={styles.actionButton}
						onPress={() => onPlayAudio(item.word)}
						accessibilityLabel={`${item.word.word} 발음 듣기`}
					>
						<MaterialIcons name="volume-up" size={22} color="#2563eb" />
					</TouchableOpacity>
				) : null}
				<TouchableOpacity
					style={styles.actionButton}
					onPress={() => onMoveToReview(item.word.word)}
					accessibilityLabel={`${item.word.word} 복습으로 이동`}
				>
					<MaterialIcons name="playlist-add" size={22} color="#2563eb" />
				</TouchableOpacity>
			</View>
		</View>
	);
}

export function FavoritesList({
	entries,
	emptyMessage = FAVORITES_LIST_TEXT.defaultEmpty,
	onMoveToReview,
	onPlayAudio,
}: FavoritesListProps) {
	const hasFavorites = entries.length > 0;

	const renderFavorite = useCallback(
		({ item }: { item: FavoriteItemProps["item"] }) => (
			<FavoriteItem item={item} onMoveToReview={onMoveToReview} onPlayAudio={onPlayAudio} />
		),
		[onMoveToReview, onPlayAudio],
	);

	const renderSeparator = useCallback(() => <View style={styles.separator} />, []);

	return (
		<View style={styles.container}>
			<View style={styles.header}>
				<View>
					<Text style={styles.sectionLabel}>{FAVORITES_LIST_TEXT.sectionLabel}</Text>
					<Text style={styles.subtitle}>{FAVORITES_LIST_TEXT.subtitle}</Text>
				</View>
				{hasFavorites ? <Text style={styles.count}>{entries.length}</Text> : null}
			</View>
			{hasFavorites ? (
				<FlatList
					data={entries}
					renderItem={renderFavorite}
					keyExtractor={(item) => item.word.word}
					ItemSeparatorComponent={renderSeparator}
					contentContainerStyle={styles.listContent}
					showsVerticalScrollIndicator={false}
					style={styles.list}
				/>
			) : (
				<Text style={styles.emptyText}>{emptyMessage}</Text>
			)}
		</View>
	);
}
