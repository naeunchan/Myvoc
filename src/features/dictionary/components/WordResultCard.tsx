import React from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { WordResultCardProps } from "@/features/dictionary/types/WordResultCard";
import { styles } from "@/features/dictionary/styles/WordResultCard.styles";

export function WordResultCard({ result, onToggleFavorite, onPlayPronunciation, isFavorite }: WordResultCardProps) {
	return (
		<View style={styles.resultCard}>
			<View style={styles.resultHeader}>
				<View>
					<Text style={styles.wordText}>{result.word}</Text>
					{result.phonetic ? <Text style={styles.phoneticText}>{result.phonetic}</Text> : null}
				</View>
				<View style={styles.resultActions}>
					{result.audioUrl ? (
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
								<Text style={styles.definitionText}>{definition.definition}</Text>
								{definition.example ? <Text style={styles.exampleText}>예: {definition.example}</Text> : null}
							</View>
						))}
					</View>
				))}
			</ScrollView>
		</View>
	);
}
