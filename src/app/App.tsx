import { NavigationContainer } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import { Audio } from "expo-av";
import React, { useCallback, useMemo, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { RootTabNavigator } from "@/components/navigation/RootTabNavigator";
import { getWordData } from "@/components/dictionary/api/getWordData";
import { DictionaryMode, WordResult } from "@/components/dictionary/types";

export default function App() {
	const [searchTerm, setSearchTerm] = useState("");
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [result, setResult] = useState<WordResult | null>(null);
	const [favorites, setFavorites] = useState<WordResult[]>([]);
	const [mode, setMode] = useState<DictionaryMode>("en-en");
	const [lastQuery, setLastQuery] = useState<string | null>(null);

	const executeSearch = useCallback(async (term: string, dictionaryMode: DictionaryMode) => {
		const normalizedTerm = term.trim();
		if (!normalizedTerm) {
			setError("검색어를 입력해주세요.");
			setResult(null);
			setLastQuery(null);
			return;
		}

		setError(null);
		setLastQuery(normalizedTerm);
		setLoading(true);
		try {
			const data = await getWordData(term, dictionaryMode);
			setResult(data);
		} catch (err) {
			const message = err instanceof Error ? err.message : "오류가 발생했어요.";
			setResult(null);
			setError(message);
		} finally {
			setLoading(false);
		}
	}, []);

	const handleSearch = useCallback(() => {
		executeSearch(searchTerm, mode);
	}, [executeSearch, mode, searchTerm]);

	const handleModeChange = useCallback(
		(nextMode: DictionaryMode) => {
			setMode(nextMode);
			if (searchTerm.trim()) {
				executeSearch(searchTerm, nextMode);
			}
		},
		[executeSearch, searchTerm],
	);

	const isCurrentFavorite = useMemo(() => {
		if (!result) {
			return false;
		}
		return favorites.some((item) => item.word === result.word);
	}, [favorites, result]);

	const toggleFavorite = useCallback((word: WordResult) => {
		setFavorites((current) => {
			const exists = current.some((item) => item.word === word.word);
			if (exists) {
				return current.filter((item) => item.word !== word.word);
			}
			return [word, ...current];
		});
	}, []);

	const playPronunciation = useCallback(async () => {
		if (!result?.audioUrl) {
			return;
		}

		try {
			const { sound } = await Audio.Sound.createAsync({ uri: result.audioUrl });
			await sound.playAsync();
			sound.setOnPlaybackStatusUpdate((status) => {
				if (status.isLoaded && status.didJustFinish) {
					sound.unloadAsync();
				}
			});
		} catch (err) {
			const message = err instanceof Error ? err.message : "발음을 재생할 수 없어요.";
			setError(message);
		}
	}, [result]);

	return (
		<>
			<StatusBar style="dark" />
			<View style={styles.container}>
				<View style={styles.bannerPlaceholder}>
					<Text style={styles.bannerText}>광고 배너 영역</Text>
				</View>
				<View style={styles.content}>
					<NavigationContainer>
						<RootTabNavigator
							favorites={favorites}
							onToggleFavorite={toggleFavorite}
							searchTerm={searchTerm}
							onChangeSearchTerm={setSearchTerm}
							onSubmitSearch={handleSearch}
							loading={loading}
							error={error}
							result={result}
							isCurrentFavorite={isCurrentFavorite}
							onPlayPronunciation={playPronunciation}
							mode={mode}
							onModeChange={handleModeChange}
							lastQuery={lastQuery}
						/>
					</NavigationContainer>
				</View>
			</View>
		</>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#ffffff",
	},
	bannerPlaceholder: {
		height: 80,
		backgroundColor: "#f3f4f6",
		borderBottomWidth: 1,
		borderBottomColor: "#e5e7eb",
		alignItems: "center",
		justifyContent: "center",
	},
	bannerText: {
		fontSize: 14,
		color: "#6b7280",
	},
	content: {
		flex: 1,
	},
});
