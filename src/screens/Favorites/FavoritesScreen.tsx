import React, { useMemo, useState } from "react";
import { Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { FavoritesFlashcard } from "@/screens/Favorites/components/FavoritesFlashcard";
import { FavoritesScreenProps } from "@/screens/Favorites/FavoritesScreen.types";
import { styles } from "@/screens/Favorites/FavoritesScreen.styles";
import { MEMORIZATION_STATUSES, MEMORIZATION_STATUS_ORDER, MemorizationStatus } from "@/features/favorites/types";

export function FavoritesScreen({ favorites, onUpdateStatus, onRemoveFavorite }: FavoritesScreenProps) {
	const [activeStatus, setActiveStatus] = useState<MemorizationStatus>("toMemorize");

	const filteredEntries = useMemo(
		() => favorites.filter((entry) => entry.status === activeStatus),
		[favorites, activeStatus],
	);
	const emptyMessage = useMemo(() => `${MEMORIZATION_STATUSES[activeStatus]}에 단어가 없어요.`, [activeStatus]);

	return (
		<SafeAreaView style={styles.safeArea}>
			<View style={styles.content}>
				<Text style={styles.title}>내 단어장</Text>
				<View style={styles.segmentedControl}>
					{MEMORIZATION_STATUS_ORDER.map((status) => {
						const label = MEMORIZATION_STATUSES[status];
						const isActive = status === activeStatus;
						return (
							<Pressable
								key={status}
								style={[styles.segmentButton, isActive && styles.segmentButtonActive]}
								onPress={() => setActiveStatus(status)}
							>
								<Text style={[styles.segmentButtonText, isActive && styles.segmentButtonTextActive]}>{label}</Text>
							</Pressable>
						);
					})}
				</View>

				{filteredEntries.length > 0 ? (
					<FavoritesFlashcard
						entries={filteredEntries}
						status={activeStatus}
						onMoveToStatus={onUpdateStatus}
						onRemoveFavorite={onRemoveFavorite}
					/>
				) : (
					<Text style={styles.emptyText}>{emptyMessage}</Text>
				)}
			</View>
		</SafeAreaView>
	);
}
