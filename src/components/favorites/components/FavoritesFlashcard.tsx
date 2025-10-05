import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { FavoritesFlashcardProps } from "@/components/favorites/types/FavoritesFlashcard";
import { styles } from "@/components/favorites/styles/FavoritesFlashcard.styles";

const ICONS = {
	reveal: {
		visible: "visibility",
		hidden: "visibility-off",
	},
	next: "navigate-next",
	remove: "delete-outline",
} as const;

export function FavoritesFlashcard({ favorites, onRemove }: FavoritesFlashcardProps) {
	const [currentIndex, setCurrentIndex] = useState(0);
	const [showMeaning, setShowMeaning] = useState(false);

	useEffect(() => {
		if (favorites.length === 0) {
			setCurrentIndex(0);
			setShowMeaning(false);
			return;
		}

		setCurrentIndex(Math.floor(Math.random() * favorites.length));
		setShowMeaning(false);
	}, [favorites]);

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

		setCurrentIndex((previous) => {
			let nextIndex = previous;
			while (nextIndex === previous) {
				nextIndex = Math.floor(Math.random() * favorites.length);
			}
			return nextIndex;
		});
		setShowMeaning(false);
	}, [favorites.length]);

	const handleRemove = useCallback(() => {
		if (currentWord) {
			onRemove(currentWord);
		}
	}, [currentWord, onRemove]);

	if (!currentWord) {
		return null;
	}

	const revealIconName = showMeaning ? ICONS.reveal.hidden : ICONS.reveal.visible;

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
					<MaterialIcons name={ICONS.next} size={28} color="#1f2937" />
				</TouchableOpacity>
				<TouchableOpacity style={styles.actionButton} onPress={handleRemove} accessibilityLabel="단어 제거">
					<MaterialIcons name={ICONS.remove} size={28} color="#ef4444" />
				</TouchableOpacity>
			</View>
		</View>
	);
}
