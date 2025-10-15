import React from "react";
import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { DictionaryModeToggle } from "@/features/dictionary/components/DictionaryModeToggle";
import { SearchBar } from "@/screens/Search/components/SearchBar";
import { SearchResults } from "@/screens/Search/components/SearchResults";
import { SearchScreenProps } from "@/screens/Search/SearchScreen.types";
import { styles } from "@/screens/Search/SearchScreen.styles";

export function SearchScreen({
	searchTerm,
	onChangeSearchTerm,
	onSubmit,
	loading,
	error,
	result,
	onToggleFavorite,
	isCurrentFavorite,
	onPlayPronunciation,
	mode,
	onModeChange,
}: SearchScreenProps) {
	return (
		<SafeAreaView style={styles.safeArea}>
			<View style={styles.content}>
				<Text style={styles.title}>단어 검색</Text>

				<DictionaryModeToggle mode={mode} onChange={onModeChange} />

				<SearchBar value={searchTerm} onChangeText={onChangeSearchTerm} onSubmit={onSubmit} />

				<SearchResults
					loading={loading}
					error={error}
					result={result}
					isFavorite={isCurrentFavorite}
					onToggleFavorite={onToggleFavorite}
					onPlayPronunciation={onPlayPronunciation}
				/>
			</View>
		</SafeAreaView>
	);
}
