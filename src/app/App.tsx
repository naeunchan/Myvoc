import { NavigationContainer } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import { Audio } from "expo-av";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { LoginScreen } from "@/screens/Auth/LoginScreen";
import { RootTabNavigator } from "@/navigation/RootTabNavigator";
import { getWordData } from "@/features/dictionary/api/getWordData";
import { DictionaryMode, WordResult } from "@/features/dictionary/types";
import {
	getActiveSession,
	getFavoritesByUser,
	getOrCreateUser,
	initializeDatabase,
	removeFavoriteForUser,
	setGuestSession,
	setUserSession,
	upsertFavoriteForUser,
	type UserRecord,
} from "@/database";

export default function App() {
	const [searchTerm, setSearchTerm] = useState("");
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [result, setResult] = useState<WordResult | null>(null);
	const [favorites, setFavorites] = useState<WordResult[]>([]);
	const [mode, setMode] = useState<DictionaryMode>("en-en");
	const [lastQuery, setLastQuery] = useState<string | null>(null);
	const [user, setUser] = useState<UserRecord | null>(null);
	const [initializing, setInitializing] = useState(true);
	const [isGuest, setIsGuest] = useState(false);
	const [guestSearchCount, setGuestSearchCount] = useState(0);
	const [authError, setAuthError] = useState<string | null>(null);
	const [authLoading, setAuthLoading] = useState(false);

	useEffect(() => {
		let isMounted = true;

		async function bootstrap() {
			try {
				await initializeDatabase();
				const session = await getActiveSession();
				if (!isMounted) {
					return;
				}

				if (!session) {
					setIsGuest(false);
					setUser(null);
					setFavorites([]);
					setGuestSearchCount(0);
					return;
				}

				if (session.isGuest) {
					setIsGuest(true);
					setUser(null);
					setFavorites([]);
					setGuestSearchCount(0);
					return;
				}

				if (!session.user) {
					setIsGuest(false);
					setUser(null);
					setFavorites([]);
					setGuestSearchCount(0);
					return;
				}

				const storedFavorites = await getFavoritesByUser(session.user.id);
				if (!isMounted) {
					return;
				}

				setUser(session.user);
				setIsGuest(false);
				setFavorites(storedFavorites);
				setGuestSearchCount(0);
			} catch (err) {
				if (!isMounted) {
					return;
				}
				const message = err instanceof Error ? err.message : "데이터베이스를 초기화하지 못했어요.";
				setError(message);
			} finally {
				if (isMounted) {
					setInitializing(false);
				}
			}
		}

		bootstrap();

		return () => {
			isMounted = false;
		};
	}, []);

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
		const normalizedTerm = searchTerm.trim();
		if (isGuest && guestSearchCount >= 10) {
			setError("게스트는 최대 10회까지 검색할 수 있어요.");
			return;
		}

		if (!normalizedTerm) {
			executeSearch(searchTerm, mode);
			return;
		}

		if (isGuest) {
			setGuestSearchCount((count) => count + 1);
		}

		executeSearch(searchTerm, mode);
	}, [executeSearch, guestSearchCount, isGuest, mode, searchTerm]);

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

	const toggleFavorite = useCallback(
		async (word: WordResult) => {
			if (isGuest) {
				setError("게스트 모드에서는 단어를 저장할 수 없어요.");
				return;
			}
			if (!user) {
				setError("사용자 정보를 불러오지 못했어요.");
				return;
			}

			const previousFavorites = favorites;
			const exists = previousFavorites.some((item) => item.word === word.word);
			const nextFavorites = exists
				? previousFavorites.filter((item) => item.word !== word.word)
				: [word, ...previousFavorites];

			setFavorites(nextFavorites);

			try {
				if (exists) {
					await removeFavoriteForUser(user.id, word.word);
				} else {
					await upsertFavoriteForUser(user.id, word);
				}
			} catch (err) {
				setFavorites(previousFavorites);
				const message = err instanceof Error ? err.message : "즐겨찾기를 업데이트할 수 없어요.";
				setError(message);
			}
		},
		[favorites, isGuest, user],
	);

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

	const handleGuestAccess = useCallback(async () => {
		setAuthLoading(true);
		setAuthError(null);
		try {
			await setGuestSession();
			setIsGuest(true);
			setUser(null);
			setFavorites([]);
			setGuestSearchCount(0);
			setSearchTerm("");
			setResult(null);
			setLastQuery(null);
			setError(null);
		} catch (err) {
			const message = err instanceof Error ? err.message : "게스트 모드로 전환하지 못했어요.";
			setAuthError(message);
		} finally {
			setAuthLoading(false);
		}
	}, []);

	const handleLogin = useCallback(
		async (username: string, displayName: string) => {
			const trimmedUsername = username.trim();
			const trimmedDisplayName = displayName.trim();
			if (!trimmedUsername) {
				setAuthError("사용자 이름을 입력해주세요.");
				return;
			}

			setAuthLoading(true);
			setAuthError(null);
			try {
				const userRecord = await getOrCreateUser(trimmedUsername, trimmedDisplayName || trimmedUsername);
				await setUserSession(userRecord.id);
				const storedFavorites = await getFavoritesByUser(userRecord.id);
				setIsGuest(false);
				setUser(userRecord);
				setFavorites(storedFavorites);
				setGuestSearchCount(0);
				setSearchTerm("");
				setResult(null);
				setLastQuery(null);
				setError(null);
			} catch (err) {
				const message = err instanceof Error ? err.message : "로그인 중 문제가 발생했어요.";
				setAuthError(message);
			} finally {
				setAuthLoading(false);
			}
		},
		[],
	);

	const isAuthenticated = isGuest || user !== null;

	return (
		<>
			<StatusBar style="dark" />
			<View style={styles.container}>
				<View style={styles.bannerPlaceholder}>
					<Text style={styles.bannerText}>광고 배너 영역</Text>
				</View>
				<View style={styles.content}>
					{initializing ? (
						<View style={styles.initializingState}>
							<ActivityIndicator size="large" color="#2f80ed" />
							<Text style={styles.initializingText}>데이터를 불러오는 중이에요…</Text>
						</View>
					) : !isAuthenticated ? (
						<LoginScreen
							onLogin={handleLogin}
							onGuest={handleGuestAccess}
							loading={authLoading}
							errorMessage={authError}
						/>
					) : (
						<NavigationContainer>
							<RootTabNavigator
								favorites={favorites}
								onToggleFavorite={(word) => {
									void toggleFavorite(word);
								}}
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
								userName={user?.displayName ?? user?.username ?? "게스트"}
							/>
						</NavigationContainer>
					)}
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
	initializingState: {
		flex: 1,
		alignItems: "center",
		justifyContent: "center",
		gap: 12,
	},
	initializingText: {
		fontSize: 15,
		color: "#4b5563",
	},
});
