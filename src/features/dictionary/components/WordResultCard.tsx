import React from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { WordResultCardProps } from "@/features/dictionary/types/WordResultCard";
import { styles } from "@/features/dictionary/styles/WordResultCard.styles";

export function WordResultCard({ result, onToggleFavorite, onPlayPronunciation, isFavorite, examplesVisible, onToggleExamples }: WordResultCardProps) {
	const canPlayAudio = Boolean(result.word?.trim());
	const hasPendingExamples = result.meanings.some((meaning) => meaning.definitions.some((definition) => Boolean(definition.pendingExample)));
	const hasExamples = result.meanings.some((meaning) => meaning.definitions.some((definition) => Boolean(definition.example)));
	const noExamplesAvailable = !hasPendingExamples && !hasExamples;
	const toggleButtonLabel = hasPendingExamples ? "Loading examples..." : examplesVisible ? "Hide examples" : "Show examples";
	return (
		<View style={styles.resultCard}>
			<View style={styles.resultHeader}>
				<View>
					<Text style={styles.wordText}>{result.word}</Text>
					{result.phonetic ? <Text style={styles.phoneticText}>{result.phonetic}</Text> : null}
				</View>
				<View style={styles.resultActions}>
					{canPlayAudio ? (
						<TouchableOpacity onPress={onPlayPronunciation} style={styles.actionButton}>
							<Text style={styles.actionButtonText}>발음</Text>
						</TouchableOpacity>
					) : null}
					<TouchableOpacity onPress={() => onToggleFavorite(result)} style={styles.actionButton}>
						<Text style={styles.actionButtonText}>{isFavorite ? "★" : "☆"}</Text>
					</TouchableOpacity>
				</View>
			</View>

			<ScrollView style={styles.meaningScroll} contentContainerStyle={styles.meaningContent}>
				{result.meanings.map((meaning, index) => (
					<View key={`${meaning.partOfSpeech}-${index}`} style={styles.meaningBlock}>
						{meaning.partOfSpeech ? <Text style={styles.partOfSpeech}>{meaning.partOfSpeech}</Text> : null}
						{meaning.definitions.map((definition, defIndex) => (
							<View key={defIndex} style={styles.definitionRow}>
								<Text style={styles.definitionText}>• {definition.definition}</Text>
								{definition.pendingTranslation && definition.originalDefinition ? <Text style={styles.definitionHint}>({definition.originalDefinition})</Text> : null}
								{!definition.pendingTranslation && definition.originalDefinition && definition.definition !== definition.originalDefinition ? (
									<Text style={styles.definitionHint}>{definition.originalDefinition}</Text>
								) : null}
								{examplesVisible ? (
									definition.pendingExample ? (
										<View style={styles.exampleSkeleton} />
									) : definition.example ? (
										<Text style={styles.exampleText}>ex) {definition.example}</Text>
									) : null
								) : null}
							</View>
						))}
					</View>
				))}
				{examplesVisible && noExamplesAvailable ? <Text style={styles.noExampleText}>예문을 찾지 못했어요.</Text> : null}
			</ScrollView>
			<TouchableOpacity style={[styles.exampleToggleButton, hasPendingExamples ? styles.exampleToggleButtonDisabled : null]} onPress={onToggleExamples} disabled={hasPendingExamples}>
				<Text style={[styles.exampleToggleButtonText, hasPendingExamples ? styles.exampleToggleButtonTextDisabled : null]}>{toggleButtonLabel}</Text>
			</TouchableOpacity>
		</View>
	);
}
