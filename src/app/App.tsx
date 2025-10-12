import { NavigationContainer } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import { Audio } from "expo-av";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { LoginScreen } from "@/screens/Auth/LoginScreen";
import { RootTabNavigator } from "@/navigation/RootTabNavigator";
import { getWordData } from "@/features/dictionary/api/getWordData";
import { DictionaryMode, WordResult } from "@/features/dictionary/types";
import {
	clearSession,
	createUser,
	findUserByUsername,
	getActiveSession,
	getFavoritesByUser,
	hashPassword,
	initializeDatabase,
	removeFavoriteForUser,
	setGuestSession,
	setUserSession,
	upsertFavoriteForUser,
	type UserRecord,
} from "@/database";
const GOOGLE_USERNAME_MIN_LENGTH = 6;
const GOOGLE_USERNAME_MAX_LENGTH = 30;

function getGoogleUsernameValidationError(username: string): string | null {
	if (!username) {
		return "아이디를 입력해주세요.";
	}
	const lowercaseUsername = username.toLowerCase();
	if (username !== lowercaseUsername) {
		return "아이디는 영문 소문자, 숫자, 마침표만 사용할 수 있어요.";
	}
	if (lowercaseUsername.length < GOOGLE_USERNAME_MIN_LENGTH || lowercaseUsername.length > GOOGLE_USERNAME_MAX_LENGTH) {
		return `아이디는 ${GOOGLE_USERNAME_MIN_LENGTH}자 이상 ${GOOGLE_USERNAME_MAX_LENGTH}자 이하로 입력해주세요.`;
	}
	if (!/^[a-z0-9.]+$/.test(lowercaseUsername)) {
		return "아이디는 영문 소문자, 숫자, 마침표만 사용할 수 있어요.";
	}
	if (lowercaseUsername.startsWith(".") || lowercaseUsername.endsWith(".")) {
		return "아이디는 마침표로 시작하거나 끝날 수 없어요.";
	}
	if (lowercaseUsername.includes("..")) {
		return "아이디에는 연속된 마침표를 사용할 수 없어요.";
	}
	return null;
}

function getGooglePasswordValidationError(password: string): string | null {
	if (!password) {
		return "비밀번호를 입력해주세요.";
	}
	if (password.length < 8) {
		return "비밀번호는 8자 이상이어야 해요.";
	}
	if (/\s/.test(password)) {
		return "비밀번호에는 공백을 사용할 수 없어요.";
	}
	const hasLetter = /[A-Za-z]/.test(password);
	const hasNumber = /[0-9]/.test(password);
	if (!hasLetter || !hasNumber) {
		return "비밀번호에는 영문과 숫자를 모두 포함해야 해요.";
	}
	return null;
}

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
	const [authError, setAuthError] = useState<string | null>(null);
	const [authLoading, setAuthLoading] = useState(false);
	const [authMode, setAuthMode] = useState<"login" | "signup">("login");

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
					return;
				}

				if (session.isGuest) {
					await clearSession();
					if (!isMounted) {
						return;
					}
					setIsGuest(false);
					setUser(null);
					setFavorites([]);
					return;
				}

				if (!session.user) {
					setIsGuest(false);
					setUser(null);
					setFavorites([]);
					return;
				}

				const storedFavorites = await getFavoritesByUser(session.user.id);
				if (!isMounted) {
					return;
				}

				setUser(session.user);
				setIsGuest(false);
				setFavorites(storedFavorites);
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
		if (!normalizedTerm) {
			executeSearch(searchTerm, mode);
			return;
		}

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

	const toggleFavorite = useCallback(
		async (word: WordResult) => {
			const previousFavorites = favorites;
			const exists = previousFavorites.some((item) => item.word === word.word);
			const nextFavorites = exists
				? previousFavorites.filter((item) => item.word !== word.word)
				: [word, ...previousFavorites];

			if (isGuest) {
				if (!exists && previousFavorites.length >= 10) {
					setError("게스트 모드는 단어를 최대 10개까지 저장할 수 있어요.");
					return;
				}
				setError(null);
				setFavorites(nextFavorites);
				return;
			}

			if (!user) {
				setError("사용자 정보를 불러오지 못했어요.");
				return;
			}

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
			setSearchTerm("");
			setResult(null);
			setLastQuery(null);
			setError(null);
			setAuthMode("login");
		} catch (err) {
			const message = err instanceof Error ? err.message : "게스트 모드로 전환하지 못했어요.";
			setAuthError(message);
		} finally {
			setAuthLoading(false);
		}
	}, []);

	const resetToLoginState = useCallback((mode: "login" | "signup" = "login") => {
		setAuthMode(mode);
		setIsGuest(false);
		setUser(null);
		setFavorites([]);
		setSearchTerm("");
		setResult(null);
		setLastQuery(null);
		setError(null);
		setAuthLoading(false);
	}, []);

	const handleGuestAuthRedirect = useCallback(
		async (mode: "login" | "signup") => {
			setAuthError(null);
			try {
				await clearSession();
			} catch (err) {
				const message = err instanceof Error ? err.message : "계정 화면으로 이동하지 못했어요.";
				setAuthError(message);
			} finally {
				resetToLoginState(mode);
			}
		},
		[resetToLoginState],
	);

	const handleGuestLoginRequest = useCallback(() => {
		void handleGuestAuthRedirect("login");
	}, [handleGuestAuthRedirect]);

	const handleGuestSignUpRequest = useCallback(() => {
		void handleGuestAuthRedirect("signup");
	}, [handleGuestAuthRedirect]);

	const loadUserState = useCallback(async (userRecord: UserRecord) => {
		await setUserSession(userRecord.id);
		const storedFavorites = await getFavoritesByUser(userRecord.id);
		setIsGuest(false);
		setUser(userRecord);
		setFavorites(storedFavorites);
		setSearchTerm("");
		setResult(null);
		setLastQuery(null);
		setError(null);
		setAuthError(null);
	}, []);

	const handleLogout = useCallback(async () => {
		setAuthLoading(true);
		setAuthError(null);
		try {
			await clearSession();
		} catch (err) {
			const message = err instanceof Error ? err.message : "로그아웃 중 문제가 발생했어요.";
			setAuthError(message);
		} finally {
			setAuthLoading(false);
			resetToLoginState();
		}
	}, [resetToLoginState]);

	const handleLogin = useCallback(
		async (username: string, password: string) => {
			const trimmedUsername = username.trim();
			const trimmedPassword = password.trim();
			if (!trimmedUsername || !trimmedPassword) {
				setAuthError("아이디와 비밀번호를 모두 입력해주세요.");
				return;
			}

			setAuthLoading(true);
			setAuthError(null);
			try {
				const sanitizedUsername = trimmedUsername.toLowerCase();
				const userRecord = await findUserByUsername(sanitizedUsername);
				if (!userRecord || !userRecord.passwordHash) {
					setAuthError("아이디 또는 비밀번호가 올바르지 않아요.");
					return;
				}

				const hashedPassword = await hashPassword(trimmedPassword);
				if (userRecord.passwordHash !== hashedPassword) {
					setAuthError("아이디 또는 비밀번호가 올바르지 않아요.");
					return;
				}

				const userWithoutPassword: UserRecord = {
					id: userRecord.id,
					username: userRecord.username,
					displayName: userRecord.displayName,
				};
				await loadUserState(userWithoutPassword);
			} catch (err) {
				const message = err instanceof Error ? err.message : "로그인 중 문제가 발생했어요.";
				setAuthError(message);
			} finally {
				setAuthLoading(false);
			}
		},
		[loadUserState],
	);

	const handleSignUp = useCallback(
		async (username: string, password: string, displayName: string) => {
			const trimmedUsername = username.trim();
			const trimmedPassword = password.trim();
			const trimmedDisplayName = displayName.trim();

			const usernameValidationError = getGoogleUsernameValidationError(trimmedUsername);
			if (usernameValidationError) {
				setAuthError(usernameValidationError);
				return;
			}

			const passwordValidationError = getGooglePasswordValidationError(trimmedPassword);
			if (passwordValidationError) {
				setAuthError(passwordValidationError);
				return;
			}

			const sanitizedUsername = trimmedUsername.toLowerCase();
			setAuthLoading(true);
			setAuthError(null);
			try {
				const existingUser = await findUserByUsername(sanitizedUsername);
				if (existingUser) {
					setAuthError("이미 사용 중인 아이디예요. 다른 아이디를 선택해주세요.");
					return;
				}

				const newUser = await createUser(sanitizedUsername, trimmedPassword, trimmedDisplayName || sanitizedUsername);
				await loadUserState(newUser);
			} catch (err) {
				if (err instanceof Error && err.message.includes("UNIQUE")) {
					setAuthError("이미 사용 중인 아이디예요. 다른 아이디를 선택해주세요.");
				} else {
					const message = err instanceof Error ? err.message : "회원가입 중 문제가 발생했어요.";
					setAuthError(message);
				}
			} finally {
				setAuthLoading(false);
			}
		},
		[loadUserState],
	);

	const isAuthenticated = isGuest || user !== null;

	return (
		<SafeAreaProvider>
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
							onSignUp={handleSignUp}
							onGuest={handleGuestAccess}
							loading={authLoading}
							errorMessage={authError}
							initialMode={authMode}
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
								onLogout={handleLogout}
								canLogout={user !== null}
								isGuest={isGuest}
								onRequestLogin={handleGuestLoginRequest}
								onRequestSignUp={handleGuestSignUpRequest}
							/>
						</NavigationContainer>
					)}
				</View>
			</View>
		</SafeAreaProvider>
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
