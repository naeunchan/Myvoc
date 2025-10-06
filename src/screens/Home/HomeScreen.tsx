import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { FlatList, Text, TouchableOpacity, View } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { MODE_LABEL } from "@/screens/Home/constants";
import { HomeScreenProps } from "@/screens/Home/HomeScreen.types";
import { styles } from "@/screens/Home/HomeScreen.styles";

export function HomeScreen({ favoritesCount, lastSearchedWord, mode, favorites, onRemoveFavorite, userName }: HomeScreenProps) {
	const hasFavorites = favorites.length > 0;

	const renderFavorite = ({ item }: { item: HomeScreenProps["favorites"][number] }) => {
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
	};

	const renderSeparator = () => <View style={styles.favoriteSeparator} />;

	return (
		<SafeAreaView style={styles.safeArea}>
			<View style={styles.content}>
				<Text style={styles.title}>나만의 영어 단어장</Text>
				<Text style={styles.subtitle}>하단의 탭을 눌러 기능을 이용해보세요.</Text>

				<View style={styles.card}>
					<Text style={styles.cardTitle}>현재 요약</Text>
					<Text style={styles.cardText}>사용자: {userName}</Text>
					<Text style={styles.cardText}>사전 모드: {MODE_LABEL[mode]}</Text>
					<Text style={styles.cardText}>내 단어장: {favoritesCount}개 저장됨</Text>
					{lastSearchedWord ? (
						<Text style={styles.cardText}>최근 검색: {lastSearchedWord}</Text>
					) : null}
				</View>

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
			</View>
		</SafeAreaView>
	);
}
