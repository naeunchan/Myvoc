import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Alert } from "react-native";
import Constants from "expo-constants";
import { getWordData } from "@/api/dictionary/getWordData";
import { DictionaryMode, WordResult } from "@/services/dictionary/types";
import {
	FavoriteWordEntry,
	MemorizationStatus,
	createFavoriteEntry,
} from "@/services/favorites/types";
import {
	clearAutoLoginCredentials,
	clearSession,
	createUser,
	findUserByUsername,
	getActiveSession,
	getAutoLoginCredentials,
	getFavoritesByUser,
	hasSeenAppHelp,
	hashPassword,
	initializeDatabase,
	markAppHelpSeen,
	removeFavoriteForUser,
	saveAutoLoginCredentials,
	setGuestSession,
	setUserSession,
	updateUserPassword,
	updateUserDisplayName,
	upsertFavoriteForUser,
	type UserRecord,
} from "@/services/database";
import {
	getGooglePasswordValidationError,
	getGoogleUsernameValidationError,
} from "@/utils/authValidation";
import type { LoginScreenProps } from "@/screens/Auth/LoginScreen.types";
import type { RootTabNavigatorProps } from "@/navigation/RootTabNavigator.types";
import {
	ACCOUNT_REDIRECT_ERROR_MESSAGE,
	AUDIO_PLAY_ERROR_MESSAGE,
	AUDIO_UNAVAILABLE_MESSAGE,
	DATABASE_INIT_ERROR_MESSAGE,
	DEFAULT_GUEST_NAME,
	DEFAULT_VERSION_LABEL,
	EMPTY_SEARCH_ERROR_MESSAGE,
	FAVORITE_LIMIT_MESSAGE,
	GENERIC_ERROR_MESSAGE,
	GUEST_ACCESS_ERROR_MESSAGE,
	HELP_MODAL_ERROR_MESSAGE,
	HELP_MODAL_SAVE_ERROR_MESSAGE,
	LOGIN_FAILED_ERROR_MESSAGE,
	LOGIN_GENERIC_ERROR_MESSAGE,
	LOGIN_INPUT_ERROR_MESSAGE,
	LOGOUT_ERROR_MESSAGE,
	MISSING_USER_ERROR_MESSAGE,
	REMOVE_FAVORITE_ERROR_MESSAGE,
	PROFILE_UPDATE_ERROR_MESSAGE,
	PASSWORD_REQUIRED_ERROR_MESSAGE,
	PASSWORD_UPDATE_ERROR_MESSAGE,
	SIGNUP_DUPLICATE_ERROR_MESSAGE,
	SIGNUP_GENERIC_ERROR_MESSAGE,
	TOGGLE_FAVORITE_ERROR_MESSAGE,
	UPDATE_STATUS_ERROR_MESSAGE,
} from "@/screens/App/AppScreen.constants";
import { getPronunciationAudio } from "@/api/dictionary/getPronunciationAudio";
import { fetchDictionaryEntry } from "@/api/dictionary/freeDictionaryClient";
import { applyExampleUpdates, clearPendingFlags } from "@/services/dictionary/utils/mergeExampleUpdates";
import type { AppScreenHookResult } from "@/screens/App/AppScreen.types";
import { playRemoteAudio } from "@/utils/audio";

export function useAppScreen(): AppScreenHookResult {
	const [searchTerm, setSearchTerm] = useState("");
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [result, setResult] = useState<WordResult | null>(null);
	const [examplesVisible, setExamplesVisible] = useState(false);
	const [favorites, setFavorites] = useState<FavoriteWordEntry[]>([]);
	const [mode, setMode] = useState<DictionaryMode>("en-en");
	const modeRef = useRef<DictionaryMode>("en-en");
	const [lastQuery, setLastQuery] = useState<string | null>(null);
	const [user, setUser] = useState<UserRecord | null>(null);
	const [initializing, setInitializing] = useState(true);
	const [isGuest, setIsGuest] = useState(false);
	const [authError, setAuthError] = useState<string | null>(null);
	const [authLoading, setAuthLoading] = useState(false);
	const [authMode, setAuthMode] = useState<"login" | "signup">("login");
	const [isHelpVisible, setIsHelpVisible] = useState(false);
	const [versionLabel] = useState(() => {
		const extra = Constants.expoConfig?.extra;
		return extra?.versionLabel ?? DEFAULT_VERSION_LABEL;
	});
	const activeLookupRef = useRef(0);

	const ensurePhoneticForWord = useCallback(async (word: WordResult) => {
		if (word.phonetic && word.phonetic.trim()) {
			return word;
		}

		try {
			const fallback = await fetchDictionaryEntry(word.word, "en-en");
			if (fallback.phonetic) {
				return {
					...word,
					phonetic: fallback.phonetic,
				};
			}
		} catch (error) {
			console.warn("발음 기호를 가져오는 중 문제가 발생했어요.", error);
		}

		return word;
	}, []);

	const hydrateFavorites = useCallback(
		async (entries: FavoriteWordEntry[], userId?: number | null) => {
			if (entries.length === 0) {
				return entries;
			}

			let hasChanges = false;
			const nextEntries: FavoriteWordEntry[] = [];

			for (const entry of entries) {
				const updatedWord = await ensurePhoneticForWord(entry.word);
				if (updatedWord === entry.word) {
					nextEntries.push(entry);
					continue;
				}

				const hydratedEntry: FavoriteWordEntry = {
					...entry,
					word: updatedWord,
					updatedAt: new Date().toISOString(),
				};
				nextEntries.push(hydratedEntry);
				hasChanges = true;

				if (userId) {
					try {
						await upsertFavoriteForUser(userId, hydratedEntry);
					} catch (error) {
						console.warn("즐겨찾기 발음 기호 업데이트 중 문제가 발생했어요.", error);
					}
				}
			}

			return hasChanges ? nextEntries : entries;
		},
		[ensurePhoneticForWord, upsertFavoriteForUser],
	);

	useEffect(() => {
		let isMounted = true;

		async function bootstrap() {
			let shouldShowHelp = false;
			try {
				await initializeDatabase();
				try {
					const alreadySeenHelp = await hasSeenAppHelp();
					shouldShowHelp = !alreadySeenHelp;
				} catch (prefError) {
					console.warn(HELP_MODAL_ERROR_MESSAGE, prefError);
					shouldShowHelp = true;
				}

				const session = await getActiveSession();
				if (!isMounted) {
					return;
				}

				if (!session) {
					const autoLoginEntry = await getAutoLoginCredentials();
					if (autoLoginEntry) {
						const rememberedUser = await findUserByUsername(autoLoginEntry.username);
						if (rememberedUser?.passwordHash && rememberedUser.passwordHash === autoLoginEntry.passwordHash) {
							const userRecord: UserRecord = {
								id: rememberedUser.id,
								username: rememberedUser.username,
								displayName: rememberedUser.displayName,
							};
							await setUserSession(userRecord.id);
						const storedFavorites = await getFavoritesByUser(userRecord.id);
						const hydratedFavorites = await hydrateFavorites(storedFavorites, userRecord.id);
						if (!isMounted) {
							return;
						}
						setIsGuest(false);
						setUser(userRecord);
						setFavorites(hydratedFavorites);
							setSearchTerm("");
							setResult(null);
							setLastQuery(null);
							setError(null);
							setAuthError(null);
							return;
						}
						await clearAutoLoginCredentials();
					}

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
				const hydratedFavorites = await hydrateFavorites(storedFavorites, session.user.id);
				if (!isMounted) {
					return;
				}

				setUser(session.user);
				setIsGuest(false);
				setFavorites(hydratedFavorites);
			} catch (err) {
				if (!isMounted) {
					return;
				}
				const message = err instanceof Error ? err.message : DATABASE_INIT_ERROR_MESSAGE;
				setError(message);
			} finally {
				if (isMounted) {
					setIsHelpVisible(shouldShowHelp);
					setInitializing(false);
				}
			}
		}

		void bootstrap();

		return () => {
			isMounted = false;
		};
	}, []);

	useEffect(() => {
		modeRef.current = mode;
	}, [mode]);

	const executeSearch = useCallback(
		async (term: string, dictionaryMode: DictionaryMode) => {
			const normalizedTerm = term.trim();
			if (!normalizedTerm) {
				activeLookupRef.current += 1;
				setError(EMPTY_SEARCH_ERROR_MESSAGE);
				setResult(null);
				setExamplesVisible(false);
				setLastQuery(null);
				setLoading(false);
				return;
			}

			const lookupId = activeLookupRef.current + 1;
			activeLookupRef.current = lookupId;

			setError(null);
			setLastQuery(normalizedTerm);
			setLoading(true);
			setExamplesVisible(false);

			try {
				const { base, examplesPromise } = await getWordData(normalizedTerm, dictionaryMode);
				if (lookupId !== activeLookupRef.current) {
					return;
				}

				setResult(base);
				setLoading(false);

				void examplesPromise
					.then((updates) => {
						if (lookupId !== activeLookupRef.current) {
							return;
						}
						setResult((previous) => {
							if (!previous) {
								return previous;
							}
							if (updates.length === 0) {
								return clearPendingFlags(previous);
							}
							return applyExampleUpdates(previous, updates, dictionaryMode);
						});
					})
					.catch((err) => {
						console.warn("예문 생성 중 문제가 발생했어요.", err);
						if (lookupId !== activeLookupRef.current) {
							return;
						}
						setResult((previous) => (previous ? clearPendingFlags(previous) : previous));
					});
			} catch (err) {
				if (lookupId !== activeLookupRef.current) {
					return;
				}
				setResult(null);
				setExamplesVisible(false);
				setLoading(false);
				const message = err instanceof Error ? err.message : GENERIC_ERROR_MESSAGE;
				setError(message);
			}
		},
		[],
	);

	const handleSearchTermChange = useCallback(
		(text: string) => {
			setSearchTerm(text);

			const trimmed = text.trim();
			if (!trimmed) {
				activeLookupRef.current += 1;
				setError(null);
				setLoading(false);
				setExamplesVisible(false);
				return;
			}
			// Cancel any in-flight result updates; user must submit explicitly.
			activeLookupRef.current += 1;
			setLoading(false);
		},
		[],
	);

	const handleSearch = useCallback(() => {
		void executeSearch(searchTerm, mode);
	}, [executeSearch, mode, searchTerm]);

	const handleModeChange = useCallback(
		(nextMode: DictionaryMode) => {
			if (nextMode === "en-ko") {
				return;
			}
			if (modeRef.current === nextMode) {
				return;
			}
			activeLookupRef.current += 1;
			setMode(nextMode);
			modeRef.current = nextMode;
			setResult(null);
			setError(null);
			setLastQuery(null);
			setLoading(false);
			setExamplesVisible(false);
		},
		[],
	);

	const handleToggleExamples = useCallback(() => {
		setExamplesVisible((previous) => !previous);
	}, []);

	const isCurrentFavorite = useMemo(() => {
		if (!result) {
			return false;
		}
		return favorites.some((item) => item.word.word === result.word);
	}, [favorites, result]);

	const removeFavoritePersisted = useCallback(
		async (word: string) => {
			if (!user) {
				setError(MISSING_USER_ERROR_MESSAGE);
				return;
			}

			const previousFavorites = favorites;
			const nextFavorites = previousFavorites.filter((item) => item.word.word !== word);
			setFavorites(nextFavorites);

			try {
				await removeFavoriteForUser(user.id, word);
			} catch (err) {
				setFavorites(previousFavorites);
				const message = err instanceof Error ? err.message : REMOVE_FAVORITE_ERROR_MESSAGE;
				setError(message);
			}
		},
		[favorites, user],
	);

	const toggleFavoriteAsync = useCallback(
		async (word: WordResult) => {
			const wordWithPhonetic = await ensurePhoneticForWord(word);
			const normalizedWord = clearPendingFlags(wordWithPhonetic);
			const previousFavorites = favorites;
			const existingEntry = previousFavorites.find((item) => item.word.word === word.word);

			if (isGuest) {
				if (!existingEntry && previousFavorites.length >= 10) {
					setError(FAVORITE_LIMIT_MESSAGE);
					return;
				}
				setError(null);
				if (existingEntry) {
					setFavorites(previousFavorites.filter((item) => item.word.word !== word.word));
				} else {
					setFavorites([createFavoriteEntry(normalizedWord), ...previousFavorites]);
				}
				return;
			}

			if (!user) {
				setError(MISSING_USER_ERROR_MESSAGE);
				return;
			}

			if (existingEntry) {
				void removeFavoritePersisted(word.word);
				return;
			}

			const newEntry = createFavoriteEntry(normalizedWord, "toMemorize");
			const nextFavorites = [newEntry, ...previousFavorites];
			setFavorites(nextFavorites);

			try {
				await upsertFavoriteForUser(user.id, newEntry);
			} catch (err) {
				setFavorites(previousFavorites);
				const message = err instanceof Error ? err.message : TOGGLE_FAVORITE_ERROR_MESSAGE;
				setError(message);
			}
		},
		[ensurePhoneticForWord, favorites, isGuest, removeFavoritePersisted, user],
	);

	const updateFavoriteStatusAsync = useCallback(
		async (word: string, nextStatus: MemorizationStatus) => {
			const previousFavorites = favorites;
			const target = previousFavorites.find((item) => item.word.word === word);
			if (!target) {
				return;
			}

			const updatedEntry: FavoriteWordEntry = {
				...target,
				status: nextStatus,
				updatedAt: new Date().toISOString(),
			};
			const nextFavorites = previousFavorites.map((item) => (item.word.word === word ? updatedEntry : item));
			setFavorites(nextFavorites);

			if (isGuest) {
				return;
			}

			if (!user) {
				setFavorites(previousFavorites);
				setError(MISSING_USER_ERROR_MESSAGE);
				return;
			}

			try {
				await upsertFavoriteForUser(user.id, updatedEntry);
			} catch (err) {
				setFavorites(previousFavorites);
				const message = err instanceof Error ? err.message : UPDATE_STATUS_ERROR_MESSAGE;
				setError(message);
			}
		},
		[favorites, isGuest, user],
	);

	const handleRemoveFavorite = useCallback(
		(word: string) => {
			if (isGuest) {
				setFavorites((previous) => previous.filter((item) => item.word.word !== word));
				return;
			}

			void removeFavoritePersisted(word);
		},
		[isGuest, removeFavoritePersisted],
	);

	const playPronunciationAsync = useCallback(async () => {
		const currentWord = result?.word?.trim();
		if (!currentWord) {
			Alert.alert(AUDIO_PLAY_ERROR_MESSAGE, AUDIO_UNAVAILABLE_MESSAGE);
			return;
		}

		try {
			const uri = await getPronunciationAudio(currentWord);
			await playRemoteAudio(uri);
		} catch (err) {
			const message = err instanceof Error ? err.message : AUDIO_PLAY_ERROR_MESSAGE;
			setError(message);
			Alert.alert(AUDIO_PLAY_ERROR_MESSAGE, message);
		}
	}, [result?.word]);

	const handlePlayWordAudioAsync = useCallback(async (word: WordResult) => {
		const target = word.word?.trim();
		if (!target) {
			Alert.alert(AUDIO_PLAY_ERROR_MESSAGE, AUDIO_UNAVAILABLE_MESSAGE);
			return;
		}

		try {
			const uri = await getPronunciationAudio(target);
			await playRemoteAudio(uri);
		} catch (err) {
			const message = err instanceof Error ? err.message : AUDIO_PLAY_ERROR_MESSAGE;
			Alert.alert(AUDIO_PLAY_ERROR_MESSAGE, message);
		}
	}, []);

	const setInitialAuthState = useCallback(() => {
		setIsGuest(false);
		setUser(null);
		setFavorites([]);
		setSearchTerm("");
		setResult(null);
		setExamplesVisible(false);
		setLastQuery(null);
		setError(null);
		setAuthError(null);
	}, []);

	const handleGuestAccessAsync = useCallback(async () => {
		setAuthLoading(true);
		setAuthError(null);
		try {
			await setGuestSession();
			setIsGuest(true);
			setUser(null);
			setFavorites([]);
			setSearchTerm("");
			setResult(null);
			setExamplesVisible(false);
			setLastQuery(null);
			setError(null);
			setAuthMode("login");
		} catch (err) {
			const message = err instanceof Error ? err.message : GUEST_ACCESS_ERROR_MESSAGE;
			setAuthError(message);
		} finally {
			setAuthLoading(false);
		}
	}, []);

	const resetToLoginState = useCallback((mode: "login" | "signup" = "login") => {
		setAuthMode(mode);
		setInitialAuthState();
		setAuthLoading(false);
	}, [setInitialAuthState]);

	const handleGuestAuthRedirectAsync = useCallback(
		async (mode: "login" | "signup") => {
			setAuthError(null);
			try {
				await clearSession();
			} catch (err) {
				const message = err instanceof Error ? err.message : ACCOUNT_REDIRECT_ERROR_MESSAGE;
				setAuthError(message);
			} finally {
				resetToLoginState(mode);
			}
		},
		[resetToLoginState],
	);

	const handleGuestLoginRequest = useCallback(() => {
		void handleGuestAuthRedirectAsync("login");
	}, [handleGuestAuthRedirectAsync]);

	const handleGuestSignUpRequest = useCallback(() => {
		void handleGuestAuthRedirectAsync("signup");
	}, [handleGuestAuthRedirectAsync]);

	const loadUserState = useCallback(
		async (userRecord: UserRecord) => {
			await setUserSession(userRecord.id);
			const storedFavorites = await getFavoritesByUser(userRecord.id);
			const hydratedFavorites = await hydrateFavorites(storedFavorites, userRecord.id);
			setIsGuest(false);
			setUser(userRecord);
			setFavorites(hydratedFavorites);
			setSearchTerm("");
			setResult(null);
			setExamplesVisible(false);
			setLastQuery(null);
			setError(null);
			setAuthError(null);
		},
		[hydrateFavorites],
	);

	const handleShowHelp = useCallback(() => {
		setIsHelpVisible(true);
	}, []);

	const handleDismissHelp = useCallback(() => {
		setIsHelpVisible(false);
		markAppHelpSeen().catch((err) => {
			console.warn(HELP_MODAL_SAVE_ERROR_MESSAGE, err);
		});
	}, []);

	const handleLogoutAsync = useCallback(async () => {
		setAuthLoading(true);
		setAuthError(null);
		try {
			await clearSession();
			await clearAutoLoginCredentials();
		} catch (err) {
			const message = err instanceof Error ? err.message : LOGOUT_ERROR_MESSAGE;
			setAuthError(message);
		} finally {
			setAuthLoading(false);
			resetToLoginState();
		}
	}, [resetToLoginState]);

	const handleLoginAsync = useCallback(
		async (username: string, password: string, options?: { rememberMe?: boolean }) => {
			const trimmedUsername = username.trim();
			const trimmedPassword = password.trim();
			if (!trimmedUsername || !trimmedPassword) {
				setAuthError(LOGIN_INPUT_ERROR_MESSAGE);
				return;
			}

			setAuthLoading(true);
			setAuthError(null);
			try {
				const sanitizedUsername = trimmedUsername.toLowerCase();
				const rememberMe = options?.rememberMe ?? false;
				const userRecord = await findUserByUsername(sanitizedUsername);
				if (!userRecord || !userRecord.passwordHash) {
					setAuthError(LOGIN_FAILED_ERROR_MESSAGE);
					return;
				}

				const hashedPassword = await hashPassword(trimmedPassword);
				if (userRecord.passwordHash !== hashedPassword) {
					setAuthError(LOGIN_FAILED_ERROR_MESSAGE);
					return;
				}

				if (rememberMe) {
					await saveAutoLoginCredentials(sanitizedUsername, hashedPassword);
				} else {
					await clearAutoLoginCredentials();
				}

				const userWithoutPassword: UserRecord = {
					id: userRecord.id,
					username: userRecord.username,
					displayName: userRecord.displayName,
				};
				await loadUserState(userWithoutPassword);
			} catch (err) {
				const message = err instanceof Error ? err.message : LOGIN_GENERIC_ERROR_MESSAGE;
				setAuthError(message);
			} finally {
				setAuthLoading(false);
			}
		},
		[clearAutoLoginCredentials, loadUserState, saveAutoLoginCredentials],
	);

	const handleSignUpAsync = useCallback(
		async (
			username: string,
			password: string,
			displayName: string,
			options?: { rememberMe?: boolean },
		) => {
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
				const rememberMe = options?.rememberMe ?? false;
				const existingUser = await findUserByUsername(sanitizedUsername);
				if (existingUser) {
					setAuthError(SIGNUP_DUPLICATE_ERROR_MESSAGE);
					return;
				}

				const newUser = await createUser(
					sanitizedUsername,
					trimmedPassword,
					trimmedDisplayName || sanitizedUsername,
				);
				if (rememberMe) {
					const passwordHash = await hashPassword(trimmedPassword);
					await saveAutoLoginCredentials(sanitizedUsername, passwordHash);
				} else {
					await clearAutoLoginCredentials();
				}
				await loadUserState(newUser);
			} catch (err) {
				if (err instanceof Error && err.message.includes("UNIQUE")) {
					setAuthError(SIGNUP_DUPLICATE_ERROR_MESSAGE);
				} else {
					const message = err instanceof Error ? err.message : SIGNUP_GENERIC_ERROR_MESSAGE;
					setAuthError(message);
				}
			} finally {
				setAuthLoading(false);
			}
		},
		[clearAutoLoginCredentials, loadUserState, saveAutoLoginCredentials],
	);

	const toggleFavorite = useCallback(
		(word: WordResult) => {
			void toggleFavoriteAsync(word);
		},
		[toggleFavoriteAsync],
	);

	const updateFavoriteStatus = useCallback(
		(word: string, nextStatus: MemorizationStatus) => {
			void updateFavoriteStatusAsync(word, nextStatus);
		},
		[updateFavoriteStatusAsync],
	);

	const playPronunciation = useCallback(() => {
		void playPronunciationAsync();
	}, [playPronunciationAsync]);

	const handlePlayWordAudio = useCallback(
		(word: WordResult) => {
			void handlePlayWordAudioAsync(word);
		},
		[handlePlayWordAudioAsync],
	);

	const handleProfilePasswordUpdate = useCallback(
		async (password: string) => {
			if (!user) {
				throw new Error(MISSING_USER_ERROR_MESSAGE);
			}

			const trimmedPassword = password.trim();
			if (!trimmedPassword) {
				throw new Error(PASSWORD_REQUIRED_ERROR_MESSAGE);
			}

			const passwordValidationError = getGooglePasswordValidationError(trimmedPassword);
			if (passwordValidationError) {
				throw new Error(passwordValidationError);
			}

			try {
				const { user: updatedUser, passwordHash } = await updateUserPassword(user.id, trimmedPassword);
				setUser(updatedUser);
				try {
					const autoLoginEntry = await getAutoLoginCredentials();
					if (autoLoginEntry?.username === updatedUser.username) {
						await saveAutoLoginCredentials(updatedUser.username, passwordHash);
					} else if (autoLoginEntry) {
						await clearAutoLoginCredentials();
					}
				} catch (autoLoginError) {
					console.warn("자동 로그인 정보를 업데이트하는 중 문제가 발생했어요.", autoLoginError);
				}
			} catch (err) {
				const message = err instanceof Error ? err.message : PASSWORD_UPDATE_ERROR_MESSAGE;
				throw new Error(message);
			}
		},
		[user, clearAutoLoginCredentials, getAutoLoginCredentials, saveAutoLoginCredentials],
	);

	const handleProfileUpdate = useCallback(
		async (displayName: string) => {
			if (!user) {
				throw new Error(MISSING_USER_ERROR_MESSAGE);
			}

			const normalizedName = displayName.trim();
			try {
				const updated = await updateUserDisplayName(user.id, normalizedName || null);
				setUser(updated);
			} catch (err) {
				const message = err instanceof Error ? err.message : PROFILE_UPDATE_ERROR_MESSAGE;
				throw new Error(message);
			}
		},
		[user],
	);

	const handleGuestAccess = useCallback(() => {
		void handleGuestAccessAsync();
	}, [handleGuestAccessAsync]);

	const handleLogout = useCallback(() => {
		void handleLogoutAsync();
	}, [handleLogoutAsync]);

	const handleLogin = useCallback(
		(username: string, password: string, options?: { rememberMe?: boolean }) => {
			void handleLoginAsync(username, password, options);
		},
		[handleLoginAsync],
	);

	const handleSignUp = useCallback(
		(username: string, password: string, displayName: string, options?: { rememberMe?: boolean }) => {
			void handleSignUpAsync(username, password, displayName, options);
		},
		[handleSignUpAsync],
	);

	const isAuthenticated = useMemo(() => isGuest || user !== null, [isGuest, user]);
	const canLogout = user !== null;
	const userName = user?.displayName ?? user?.username ?? DEFAULT_GUEST_NAME;

	const navigatorProps = useMemo<RootTabNavigatorProps>(
		() => ({
			favorites,
			onToggleFavorite: toggleFavorite,
			onUpdateFavoriteStatus: updateFavoriteStatus,
			onRemoveFavorite: handleRemoveFavorite,
			searchTerm,
			onChangeSearchTerm: handleSearchTermChange,
			onSubmitSearch: handleSearch,
			loading,
			error,
			result,
			examplesVisible,
			onToggleExamples: handleToggleExamples,
			isCurrentFavorite,
			onPlayPronunciation: playPronunciation,
			mode,
			onModeChange: handleModeChange,
			lastQuery,
			userName,
			onLogout: handleLogout,
			canLogout,
			isGuest,
			onRequestLogin: handleGuestLoginRequest,
			onRequestSignUp: handleGuestSignUpRequest,
			onShowHelp: handleShowHelp,
			onPlayWordAudio: handlePlayWordAudio,
			appVersion: versionLabel,
			profileDisplayName: user?.displayName ?? null,
			profileUsername: user?.username ?? null,
			onUpdateProfile: handleProfileUpdate,
			onUpdatePassword: handleProfilePasswordUpdate,
		}),
		[
			canLogout,
			error,
			examplesVisible,
			favorites,
			handleGuestLoginRequest,
			handleGuestSignUpRequest,
			handleToggleExamples,
			handleProfilePasswordUpdate,
			handleProfileUpdate,
			handlePlayWordAudio,
			handleLogout,
			handleModeChange,
			handleRemoveFavorite,
			handleSearch,
			handleSearchTermChange,
			handleShowHelp,
			isCurrentFavorite,
			isGuest,
			lastQuery,
			loading,
			mode,
			playPronunciation,
			result,
			searchTerm,
			toggleFavorite,
			updateFavoriteStatus,
			user,
			userName,
			versionLabel,
		],
	);

	const loginBindings = useMemo<LoginScreenProps>(
		() => ({
			onLogin: handleLogin,
			onSignUp: handleSignUp,
			onGuest: handleGuestAccess,
			loading: authLoading,
			errorMessage: authError,
			initialMode: authMode,
		}),
		[authError, authLoading, authMode, handleGuestAccess, handleLogin, handleSignUp],
	);

	return {
		versionLabel,
		initializing,
		isHelpVisible,
		isAuthenticated,
		loginBindings,
		navigatorProps,
		handleDismissHelp,
	};
}
