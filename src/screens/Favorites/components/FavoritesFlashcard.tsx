import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { FavoritesFlashcardProps } from "@/screens/Favorites/components/FavoritesFlashcard.types";
import { MemorizationStatus } from "@/features/favorites/types";
import { styles } from "@/screens/Favorites/components/FavoritesFlashcard.styles";
import { FAVORITES_FLASHCARD_ICONS } from "@/screens/Favorites/components/constants";

export function FavoritesFlashcard({ entries, status, onMoveToStatus, onRemoveFavorite }: FavoritesFlashcardProps) {
	const [currentIndex, setCurrentIndex] = useState(0);
	const [showMeaning, setShowMeaning] = useState(false);
	const [queue, setQueue] = useState<number[]>([]);

	const shuffleIndices = useCallback(
		(excludeIndex?: number) => {
			const indices = entries
				.map((_, index) => index)
				.filter((index) => index !== excludeIndex);

			for (let i = indices.length - 1; i > 0; i -= 1) {
				const j = Math.floor(Math.random() * (i + 1));
				[indices[i], indices[j]] = [indices[j], indices[i]];
			}

			return indices;
		},
		[entries],
	);

	useEffect(() => {
		if (entries.length === 0) {
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
	}, [entries, shuffleIndices]);

	const currentEntry = entries[currentIndex];

	const primaryDefinition = useMemo(() => {
		const word = currentEntry?.word;
		if (!word) {
			return null;
		}
		const firstMeaning = word.meanings[0];
		const firstDefinition = firstMeaning?.definitions[0]?.definition;
		return firstDefinition ?? "뜻 정보가 없어요.";
	}, [currentEntry]);

	const handleToggleMeaning = useCallback(() => {
		setShowMeaning((previous) => !previous);
	}, []);

	const handleNextWord = useCallback(() => {
		if (entries.length <= 1) {
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
	}, [entries.length, shuffleIndices, currentIndex]);

	const moveToStatus = useCallback(
		(nextStatus: MemorizationStatus) => {
			const word = currentEntry?.word;
			if (!word) {
				return;
			}
			onMoveToStatus(word.word, nextStatus);
			handleNextWord();
		},
		[currentEntry, handleNextWord, onMoveToStatus],
	);

	const handleRemove = useCallback(() => {
		const word = currentEntry?.word;
		if (!word) {
			return;
		}
		onRemoveFavorite(word.word);
		handleNextWord();
	}, [currentEntry, handleNextWord, onRemoveFavorite]);

	if (!currentEntry) {
		return null;
	}

	const revealIconName = showMeaning ? FAVORITES_FLASHCARD_ICONS.reveal.hidden : FAVORITES_FLASHCARD_ICONS.reveal.visible;

	const statusActions = (() => {
		switch (status) {
			case "toMemorize":
				return [
					{
						icon: FAVORITES_FLASHCARD_ICONS.toReview,
						color: "#2563eb",
						onPress: () => moveToStatus("review"),
						label: "복습 단어장으로 이동",
					},
				];
			case "review":
				return [
					{
						icon: FAVORITES_FLASHCARD_ICONS.toMastered,
						color: "#10b981",
						onPress: () => moveToStatus("mastered"),
						label: "터득한 단어장으로 이동",
					},
				];
			case "mastered":
				return [
					{
						icon: FAVORITES_FLASHCARD_ICONS.restoreReview,
						color: "#2563eb",
						onPress: () => moveToStatus("review"),
						label: "복습 단어장으로 이동",
					},
					{
						icon: FAVORITES_FLASHCARD_ICONS.remove,
						color: "#ef4444",
						onPress: handleRemove,
						label: "단어 삭제",
					},
				];
			default:
				return [];
		}
	})();

	return (
		<View style={styles.container}>
			<View style={styles.card}>
				<Text style={styles.word}>{currentEntry.word.word}</Text>
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
				{statusActions.map((action) => (
					<TouchableOpacity
						key={action.label}
						style={styles.actionButton}
						onPress={action.onPress}
						accessibilityLabel={action.label}
					>
						<MaterialIcons name={action.icon as any} size={28} color={action.color} />
					</TouchableOpacity>
				))}
			</View>
		</View>
	);
}
