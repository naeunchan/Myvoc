import React from "react";
import { ActivityIndicator, Text, View } from "react-native";
import { WordResult } from "@/services/dictionary/types";
import { WordResultCard } from "@/services/dictionary/components/WordResultCard";
import { styles } from "@/screens/Search/SearchScreen.styles";

type SearchResultsProps = {
	loading: boolean;
	error: string | null;
	result: WordResult | null;
	examplesVisible: boolean;
	onToggleExamples: () => void;
	isFavorite: boolean;
	onToggleFavorite: (word: WordResult) => void;
	onPlayPronunciation: () => void;
};

export function SearchResults({
	loading,
	error,
	result,
	examplesVisible,
	onToggleExamples,
	isFavorite,
	onToggleFavorite,
	onPlayPronunciation,
}: SearchResultsProps) {
	if (loading) {
		return (
			<View style={styles.centered} testID="search-results-loading">
				<ActivityIndicator size="small" color="#2f80ed" />
			</View>
		);
	}

	if (error) {
		return (
			<Text style={styles.errorText} testID="search-results-error">
				{error}
			</Text>
		);
	}

	if (!result) {
		return null;
	}

	return (
		<WordResultCard
			result={result}
			onToggleFavorite={onToggleFavorite}
			onPlayPronunciation={onPlayPronunciation}
			examplesVisible={examplesVisible}
			onToggleExamples={onToggleExamples}
			isFavorite={isFavorite}
		/>
	);
}
