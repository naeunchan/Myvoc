import React from "react";
import { ActivityIndicator, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { DictionaryModeToggle } from "@/features/dictionary/components/DictionaryModeToggle";
import { WordResultCard } from "@/features/dictionary/components/WordResultCard";
import { SearchBar } from "@/screens/Search/components/SearchBar";
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

				{loading ? (
					<View style={styles.centered}>
						<ActivityIndicator size="small" color="#2f80ed" />
					</View>
				) : null}

				{error && !loading ? <Text style={styles.errorText}>{error}</Text> : null}

				{result && !loading ? (
					<WordResultCard
						result={result}
						onToggleFavorite={onToggleFavorite}
						onPlayPronunciation={onPlayPronunciation}
						isFavorite={isCurrentFavorite}
					/>
				) : null}
			</View>
		</SafeAreaView>
	);
}
