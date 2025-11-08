import React from "react";
import Ionicons from "@expo/vector-icons/Ionicons";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { SearchBar } from "@/screens/Search/components/SearchBar";
import { SearchResults } from "@/screens/Search/components/SearchResults";
import { SearchScreenProps } from "@/screens/Search/SearchScreen.types";
import { styles } from "@/screens/Search/SearchScreen.styles";

const MODE_BUTTONS = [
	{ label: "영영사전", value: "en-en", disabled: false },
	{ label: "영한사전", value: "en-ko", disabled: true },
] as const;

export function SearchScreen({
	searchTerm,
	onChangeSearchTerm,
	onSubmit,
	loading,
	error,
	result,
	examplesVisible,
	onToggleExamples,
	onToggleFavorite,
	isCurrentFavorite,
	onPlayPronunciation,
	mode,
	onModeChange,
}: SearchScreenProps) {
	const showPlaceholder = !loading && !error && !result;

	return (
		<SafeAreaView style={styles.safeArea}>
			<ScrollView contentContainerStyle={styles.scrollContent}>
				<View style={styles.modeSection}>
					<Text style={styles.sectionLabel}>사전 모드</Text>
					<View style={styles.modeButtons}>
						{MODE_BUTTONS.map((option) => {
							const isActive = option.value === mode;
							return (
								<TouchableOpacity
									key={option.value}
									style={[styles.modeButton, isActive && styles.modeButtonActive, option.disabled && styles.modeButtonDisabled]}
									activeOpacity={option.disabled ? 1 : 0.85}
									disabled={option.disabled}
									onPress={() => {
										if (!isActive && !option.disabled) {
											onModeChange(option.value);
										}
									}}
								>
									<Text style={[styles.modeButtonLabel, isActive && styles.modeButtonLabelActive, option.disabled && styles.modeButtonLabelDisabled]}>
										{option.disabled ? `${option.label} (준비중)` : option.label}
									</Text>
								</TouchableOpacity>
							);
						})}
					</View>
				</View>

				<SearchBar value={searchTerm} onChangeText={onChangeSearchTerm} onSubmit={onSubmit} />

				<View style={styles.resultsWrapper}>
					{showPlaceholder ? (
						<View style={styles.placeholderCard}>
							<Ionicons name="sparkles-outline" size={20} color="#2563eb" />
							<Text style={styles.placeholderTitle}>검색 결과가 여기에 표시됩니다</Text>
							<Text style={styles.placeholderSubtitle}>검색할 단어를 입력하고 검색 버튼을 눌러주세요.</Text>
						</View>
					) : (
						<SearchResults
							loading={loading}
							error={error}
							result={result}
							examplesVisible={examplesVisible}
							onToggleExamples={onToggleExamples}
							isFavorite={isCurrentFavorite}
							onToggleFavorite={onToggleFavorite}
							onPlayPronunciation={onPlayPronunciation}
						/>
					)}
				</View>
			</ScrollView>
		</SafeAreaView>
	);
}
