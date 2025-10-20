import { useCallback, useEffect, useMemo, useState } from "react";
import Constants from "expo-constants";
import { Audio } from "expo-av";
import { getWordData } from "@/features/dictionary/api/getWordData";
import { DictionaryMode, WordResult } from "@/features/dictionary/types";
import {
	FavoriteWordEntry,
	MemorizationStatus,
	createFavoriteEntry,
} from "@/features/favorites/types";
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
	upsertFavoriteForUser,
	type UserRecord,
} from "@/database";
import {
	getGooglePasswordValidationError,
	getGoogleUsernameValidationError,
} from "@/app/constants/authValidation";
import type { LoginScreenProps } from "@/screens/Auth/LoginScreen.types";
import type { RootTabNavigatorProps } from "@/navigation/RootTabNavigator.types";
import {
	ACCOUNT_REDIRECT_ERROR_MESSAGE,
	AUDIO_PLAY_ERROR_MESSAGE,
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
	SIGNUP_DUPLICATE_ERROR_MESSAGE,
	SIGNUP_GENERIC_ERROR_MESSAGE,
	TOGGLE_FAVORITE_ERROR_MESSAGE,
	UPDATE_STATUS_ERROR_MESSAGE,
} from "@/app/App/AppScreen.constants";
import type { AppScreenHookResult } from "@/app/App/AppScreen.types";

export function useAppScreen(): AppScreenHookResult {
	const [searchTerm, setSearchTerm] = useState("");
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [result, setResult] = useState<WordResult | null>(null);
	const [favorites, setFavorites] = useState<FavoriteWordEntry[]>([]);
	const [mode, setMode] = useState<DictionaryMode>("en-en");
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
							if (!isMounted) {
								return;
							}
							setIsGuest(false);
							setUser(userRecord);
							setFavorites(storedFavorites);
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

	const executeSearch = useCallback(
		async (term: string, dictionaryMode: DictionaryMode) => {
			const normalizedTerm = term.trim();
			if (!normalizedTerm) {
				setError(EMPTY_SEARCH_ERROR_MESSAGE);
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
				const message = err instanceof Error ? err.message : GENERIC_ERROR_MESSAGE;
				setResult(null);
				setError(message);
			} finally {
				setLoading(false);
			}
		},
		[],
	);

	const handleSearch = useCallback(() => {
		void executeSearch(searchTerm, mode);
	}, [executeSearch, mode, searchTerm]);

	const handleModeChange = useCallback(
		(nextMode: DictionaryMode) => {
			setMode(nextMode);
			if (searchTerm.trim()) {
				void executeSearch(searchTerm, nextMode);
			}
		},
		[executeSearch, searchTerm],
	);

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
					setFavorites([createFavoriteEntry(word), ...previousFavorites]);
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

			const newEntry = createFavoriteEntry(word, "toMemorize");
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
		[favorites, isGuest, removeFavoritePersisted, user],
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
		if (!result?.audioUrl) {
			return;
		}

		try {
			const { sound } = await Audio.Sound.createAsync({ uri: result.audioUrl });
			await sound.playAsync();
			sound.setOnPlaybackStatusUpdate((status) => {
				if (status.isLoaded && status.didJustFinish) {
					void sound.unloadAsync();
				}
			});
		} catch (err) {
			const message = err instanceof Error ? err.message : AUDIO_PLAY_ERROR_MESSAGE;
			setError(message);
		}
	}, [result]);

	const setInitialAuthState = useCallback(() => {
		setIsGuest(false);
		setUser(null);
		setFavorites([]);
		setSearchTerm("");
		setResult(null);
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
			setIsGuest(false);
			setUser(userRecord);
			setFavorites(storedFavorites);
			setSearchTerm("");
			setResult(null);
			setLastQuery(null);
			setError(null);
			setAuthError(null);
		},
		[],
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
			onChangeSearchTerm: setSearchTerm,
			onSubmitSearch: handleSearch,
			loading,
			error,
			result,
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
		}),
		[
			canLogout,
			error,
			favorites,
			handleGuestLoginRequest,
			handleGuestSignUpRequest,
			handleLogout,
			handleModeChange,
			handleRemoveFavorite,
			handleSearch,
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
			userName,
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
