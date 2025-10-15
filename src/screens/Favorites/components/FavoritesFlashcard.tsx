import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { FavoritesFlashcardProps } from "@/screens/Favorites/components/FavoritesFlashcard.types";
import { styles } from "@/screens/Favorites/components/FavoritesFlashcard.styles";
import { FAVORITES_FLASHCARD_ICONS } from "@/screens/Favorites/components/constants";

export function FavoritesFlashcard({ favorites, onRemove }: FavoritesFlashcardProps) {
	const [currentIndex, setCurrentIndex] = useState(0);
	const [showMeaning, setShowMeaning] = useState(false);
	const [queue, setQueue] = useState<number[]>([]);

	const shuffleIndices = useCallback(
		(excludeIndex?: number) => {
			const indices = favorites
				.map((_, index) => index)
				.filter((index) => index !== excludeIndex);

			for (let i = indices.length - 1; i > 0; i -= 1) {
				const j = Math.floor(Math.random() * (i + 1));
				[indices[i], indices[j]] = [indices[j], indices[i]];
			}

			return indices;
		},
		[favorites],
	);

	useEffect(() => {
		if (favorites.length === 0) {
			setCurrentIndex(0);
			setShowMeaning(false);
			setQueue([]);
			return;
		}

		const shuffled = shuffleIndices();
		const [nextIndex, ...rest] = shuffled;
		setCurrentIndex(nextIndex ?? 0);
		setQueue(rest);
		setShowMeaning(false);
	}, [favorites, shuffleIndices]);

	const currentWord = favorites[currentIndex];

	const primaryDefinition = useMemo(() => {
		if (!currentWord) {
			return null;
		}

		const firstMeaning = currentWord.meanings[0];
		const firstDefinition = firstMeaning?.definitions[0]?.definition;
		return firstDefinition ?? "뜻 정보가 없어요.";
	}, [currentWord]);

	const handleToggleMeaning = useCallback(() => {
		setShowMeaning((previous) => !previous);
	}, []);

	const handleNextWord = useCallback(() => {
		if (favorites.length <= 1) {
			setShowMeaning(false);
			return;
		}

		setQueue((previousQueue) => {
			let workingQueue = previousQueue;
			if (workingQueue.length === 0) {
				workingQueue = shuffleIndices(currentIndex);
			}

			const [nextIndex, ...remaining] = workingQueue;
			setCurrentIndex(nextIndex ?? currentIndex);
			setShowMeaning(false);
			return remaining;
		});
	}, [favorites.length, shuffleIndices, currentIndex]);

	const handleRemove = useCallback(() => {
		if (currentWord) {
			onRemove(currentWord);
		}
	}, [currentWord, onRemove]);

	if (!currentWord) {
		return null;
	}

	const revealIconName = showMeaning
		? FAVORITES_FLASHCARD_ICONS.reveal.hidden
		: FAVORITES_FLASHCARD_ICONS.reveal.visible;

	return (
		<View style={styles.container}>
			<View style={styles.card}>
				<Text style={styles.word}>{currentWord.word}</Text>
			</View>

			{showMeaning ? (
				<View style={styles.meaningContainer}>
					<Text style={styles.meaningLabel}>뜻</Text>
					<Text style={styles.meaningText}>{primaryDefinition}</Text>
				</View>
			) : null}

			<View style={styles.actions}>
				<TouchableOpacity style={styles.actionButton} onPress={handleToggleMeaning} accessibilityLabel="뜻 보기">
					<MaterialIcons name={revealIconName} size={28} color="#1f2937" />
				</TouchableOpacity>
				<TouchableOpacity style={styles.actionButton} onPress={handleNextWord} accessibilityLabel="다음 단어">
					<MaterialIcons name={FAVORITES_FLASHCARD_ICONS.next} size={28} color="#1f2937" />
				</TouchableOpacity>
				<TouchableOpacity style={styles.actionButton} onPress={handleRemove} accessibilityLabel="단어 제거">
					<MaterialIcons name={FAVORITES_FLASHCARD_ICONS.remove} size={28} color="#ef4444" />
				</TouchableOpacity>
			</View>
		</View>
	);
}
