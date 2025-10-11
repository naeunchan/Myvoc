import { Platform } from "react-native";
import type { SQLiteDatabase } from "expo-sqlite";
import type { WordResult } from "@/features/dictionary/types";

const DATABASE_NAME = "myvoc.db";
const isWeb = Platform.OS === "web";

type ExpoSQLiteModule = typeof import("expo-sqlite");

function getNativeSQLiteModule(): ExpoSQLiteModule {
	return require("expo-sqlite") as ExpoSQLiteModule;
}

type UserRow = {
	id: number;
	username: string;
	display_name: string | null;
	password_hash: string | null;
};

type SessionRow = {
	user_id: number | null;
	is_guest: number;
};

export type UserRecord = {
	id: number;
	username: string;
	displayName: string | null;
};

export type UserWithPasswordRecord = UserRecord & {
	passwordHash: string | null;
};

let databasePromise: Promise<SQLiteDatabase> | null = null;

async function getDatabase() {
	if (isWeb) {
		throw new Error("웹 환경에서는 SQLite 데이터베이스를 사용할 수 없어요.");
	}

	if (!databasePromise) {
		const { openDatabaseAsync } = getNativeSQLiteModule();
		databasePromise = openDatabaseAsync(DATABASE_NAME);
	}
	return databasePromise;
}

function mapUserRow(row: UserRow, fallbackDisplayName?: string): UserRecord {
	return {
		id: row.id,
		username: row.username,
		displayName: row.display_name ?? fallbackDisplayName ?? null,
	};
}

function mapUserRowWithPassword(row: UserRow, fallbackDisplayName?: string): UserWithPasswordRecord {
	return {
		...mapUserRow(row, fallbackDisplayName),
		passwordHash: row.password_hash ?? null,
	};
}

function fnv1a32(input: string) {
	let hash = 0x811c9dc5;
	for (let index = 0; index < input.length; index += 1) {
		hash ^= input.charCodeAt(index);
		hash = Math.imul(hash, 0x01000193);
	}
	return (hash >>> 0).toString(16).padStart(8, "0");
}

export async function hashPassword(password: string) {
	const salt = "myvoc::salt";
	const firstPass = fnv1a32(`${salt}:${password}`);
	const secondPass = fnv1a32(`${firstPass}:${password}`);
	return `${firstPass}${secondPass}`;
}

async function initializeDatabaseNative() {
	const db = await getDatabase();
	await db.execAsync("PRAGMA foreign_keys = ON;");
	await db.execAsync(`
		CREATE TABLE IF NOT EXISTS users (
			id INTEGER PRIMARY KEY AUTOINCREMENT,
			username TEXT NOT NULL UNIQUE,
			display_name TEXT,
			password_hash TEXT,
			created_at TEXT DEFAULT CURRENT_TIMESTAMP,
			updated_at TEXT
		);
	`);
	const userColumns = await db.getAllAsync<{ name: string }>("PRAGMA table_info(users)");
	const hasPasswordColumn = userColumns.some((column) => column.name === "password_hash");
	if (!hasPasswordColumn) {
		await db.execAsync("ALTER TABLE users ADD COLUMN password_hash TEXT");
	}
	await db.execAsync(`
		CREATE TABLE IF NOT EXISTS favorites (
			id INTEGER PRIMARY KEY AUTOINCREMENT,
			user_id INTEGER NOT NULL,
			word TEXT NOT NULL,
			data TEXT NOT NULL,
			created_at TEXT DEFAULT CURRENT_TIMESTAMP,
			updated_at TEXT,
			UNIQUE(user_id, word),
			FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
		);
	`);
	await db.execAsync(`
		CREATE TABLE IF NOT EXISTS session (
			id INTEGER PRIMARY KEY CHECK (id = 1),
			user_id INTEGER,
			is_guest INTEGER NOT NULL DEFAULT 0,
			updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
			FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
		);
	`);
}

const WEB_DB_STORAGE_KEY = "myvoc:web-db";

type WebFavoriteRow = {
	id: number;
	user_id: number;
	word: string;
	data: string;
	created_at: string;
	updated_at: string | null;
};

type WebSessionState = {
	user_id: number | null;
	is_guest: number;
	updated_at: string;
};

type WebDatabaseState = {
	users: UserRow[];
	favorites: WebFavoriteRow[];
	session: WebSessionState | null;
};

function cloneDefaultWebState(): WebDatabaseState {
	return {
		users: [],
		favorites: [],
		session: null,
	};
}

function getBrowserStorage(): Storage | null {
	try {
		if (typeof window === "undefined" || !window.localStorage) {
			return null;
		}
		return window.localStorage;
	} catch (error) {
		console.warn("로컬 저장소에 접근하는 중 문제가 발생했어요.", error);
		return null;
	}
}

function normalizeUserRows(value: unknown): UserRow[] {
	if (!Array.isArray(value)) {
		return [];
	}

	return value
		.map((candidate) => {
			if (typeof candidate !== "object" || candidate === null) {
				return null;
			}
			const row = candidate as Partial<UserRow>;
			if (typeof row.id !== "number" || typeof row.username !== "string") {
				return null;
			}
			return {
				id: row.id,
				username: row.username,
				display_name:
					typeof row.display_name === "string"
						? row.display_name
						: row.display_name === null
							? null
							: null,
				password_hash:
					typeof row.password_hash === "string"
						? row.password_hash
						: row.password_hash === null
							? null
							: null,
			};
		})
		.filter((row): row is UserRow => row !== null);
}

function normalizeFavoriteRows(value: unknown): WebFavoriteRow[] {
	if (!Array.isArray(value)) {
		return [];
	}

	return value
		.map((candidate) => {
			if (typeof candidate !== "object" || candidate === null) {
				return null;
			}
			const row = candidate as Partial<WebFavoriteRow>;
			if (
				typeof row.id !== "number" ||
				typeof row.user_id !== "number" ||
				typeof row.word !== "string" ||
				typeof row.data !== "string"
			) {
				return null;
			}
			return {
				id: row.id,
				user_id: row.user_id,
				word: row.word,
				data: row.data,
				created_at:
					typeof row.created_at === "string"
						? row.created_at
						: new Date().toISOString(),
				updated_at:
					typeof row.updated_at === "string"
						? row.updated_at
						: row.updated_at === null
							? null
							: null,
			};
		})
		.filter((row): row is WebFavoriteRow => row !== null);
}

function normalizeSession(value: unknown): WebSessionState | null {
	if (typeof value !== "object" || value === null) {
		return null;
	}
	const session = value as Partial<WebSessionState>;
	const userId =
		typeof session.user_id === "number"
			? session.user_id
			: session.user_id === null
				? null
				: null;
	const isGuest = typeof session.is_guest === "number" ? session.is_guest : null;
	if (isGuest !== 0 && isGuest !== 1) {
		return null;
	}
	return {
		user_id: userId,
		is_guest: isGuest,
		updated_at:
			typeof session.updated_at === "string"
				? session.updated_at
				: new Date().toISOString(),
	};
}

function readWebState(): WebDatabaseState {
	const storage = getBrowserStorage();
	if (!storage) {
		return cloneDefaultWebState();
	}

	const raw = storage.getItem(WEB_DB_STORAGE_KEY);
	if (!raw) {
		return cloneDefaultWebState();
	}

	try {
		const parsed = JSON.parse(raw) as Partial<WebDatabaseState>;
		return {
			users: normalizeUserRows(parsed.users),
			favorites: normalizeFavoriteRows(parsed.favorites),
			session: normalizeSession(parsed.session),
		};
	} catch (error) {
		console.warn("저장된 데이터베이스 상태를 읽는 중 문제가 발생했어요.", error);
		return cloneDefaultWebState();
	}
}

function writeWebState(state: WebDatabaseState) {
	const storage = getBrowserStorage();
	if (!storage) {
		return;
	}

	try {
		storage.setItem(WEB_DB_STORAGE_KEY, JSON.stringify(state));
	} catch (error) {
		console.warn("로컬 저장소에 데이터를 저장하는 중 문제가 발생했어요.", error);
	}
}

function generateWebUserId(users: UserRow[]) {
	return users.reduce((max, row) => (row.id > max ? row.id : max), 0) + 1;
}

function generateWebFavoriteId(favorites: WebFavoriteRow[]) {
	return favorites.reduce((max, row) => (row.id > max ? row.id : max), 0) + 1;
}

async function initializeDatabaseWeb() {
	const state = readWebState();
	writeWebState(state);
}

async function findUserByUsernameNative(username: string): Promise<UserWithPasswordRecord | null> {
	const db = await getDatabase();
	const rows = await db.getAllAsync<UserRow>(
		"SELECT id, username, display_name, password_hash FROM users WHERE username = ? LIMIT 1",
		[username],
	);

	if (rows.length === 0) {
		return null;
	}

	return mapUserRowWithPassword(rows[0]);
}

async function findUserByUsernameWeb(username: string): Promise<UserWithPasswordRecord | null> {
	const state = readWebState();
	const row = state.users.find((user) => user.username === username);
	return row ? mapUserRowWithPassword(row) : null;
}

async function createUserNative(username: string, password: string, displayName?: string) {
	const normalizedDisplayName = (displayName ?? username).trim() || username;
	const passwordHash = await hashPassword(password);
	const db = await getDatabase();

	await db.runAsync("INSERT INTO users (username, display_name, password_hash) VALUES (?, ?, ?)", [
		username,
		normalizedDisplayName,
		passwordHash,
	]);

	const inserted = await db.getAllAsync<UserRow>(
		"SELECT id, username, display_name, password_hash FROM users WHERE username = ? LIMIT 1",
		[username],
	);
	if (inserted.length === 0) {
		throw new Error("사용자 정보를 생성하지 못했어요.");
	}

	return mapUserRow(inserted[0], normalizedDisplayName);
}

async function createUserWeb(username: string, password: string, displayName?: string) {
	const state = readWebState();
	if (state.users.some((user) => user.username === username)) {
		throw new Error("이미 사용 중인 아이디예요. 다른 아이디를 선택해주세요.");
	}

	const normalizedDisplayName = (displayName ?? username).trim() || username;
	const passwordHash = await hashPassword(password);
	const newUser: UserRow = {
		id: generateWebUserId(state.users),
		username,
		display_name: normalizedDisplayName,
		password_hash: passwordHash,
	};
	const nextState: WebDatabaseState = {
		...state,
		users: [...state.users, newUser],
	};
	writeWebState(nextState);
	return mapUserRow(newUser, normalizedDisplayName);
}

async function updateUserDisplayNameNative(userId: number, displayName: string | null) {
	const db = await getDatabase();
	await db.runAsync(
		"UPDATE users SET display_name = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?",
		[displayName, userId],
	);

	const updated = await db.getAllAsync<UserRow>(
		"SELECT id, username, display_name FROM users WHERE id = ? LIMIT 1",
		[userId],
	);
	if (updated.length === 0) {
		throw new Error("사용자 정보를 찾을 수 없어요.");
	}
	return mapUserRow(updated[0]);
}

async function updateUserDisplayNameWeb(userId: number, displayName: string | null) {
	const state = readWebState();
	const existing = state.users.find((user) => user.id === userId);
	if (!existing) {
		throw new Error("사용자 정보를 찾을 수 없어요.");
	}
	const updated: UserRow = {
		...existing,
		display_name: displayName ?? null,
	};
	const nextState: WebDatabaseState = {
		...state,
		users: state.users.map((user) => (user.id === userId ? updated : user)),
	};
	writeWebState(nextState);
	return mapUserRow(updated);
}

async function getFavoritesByUserNative(userId: number) {
	const db = await getDatabase();
	const rows = await db.getAllAsync<{ data: string }>(
		"SELECT data FROM favorites WHERE user_id = ? ORDER BY created_at DESC",
		[userId],
	);

	return rows
		.map((row) => {
			try {
				return JSON.parse(row.data) as WordResult;
			} catch (error) {
				console.warn("즐겨찾기 데이터를 읽는 중 오류가 발생했어요.", error);
				return null;
			}
		})
		.filter((item): item is WordResult => item !== null);
}

async function getFavoritesByUserWeb(userId: number) {
	const state = readWebState();
	return state.favorites
		.filter((favorite) => favorite.user_id === userId)
		.map((favorite) => {
			try {
				return JSON.parse(favorite.data) as WordResult;
			} catch (error) {
				console.warn("즐겨찾기 데이터를 읽는 중 오류가 발생했어요.", error);
				return null;
			}
		})
		.filter((item): item is WordResult => item !== null);
}

async function upsertFavoriteForUserNative(userId: number, word: WordResult) {
	const db = await getDatabase();
	await db.runAsync(
		`
			INSERT INTO favorites (user_id, word, data)
			VALUES (?, ?, ?)
			ON CONFLICT(user_id, word)
			DO UPDATE SET data = excluded.data, updated_at = CURRENT_TIMESTAMP
		`,
		[userId, word.word, JSON.stringify(word)],
	);
}

async function upsertFavoriteForUserWeb(userId: number, word: WordResult) {
	const state = readWebState();
	const serialized = JSON.stringify(word);
	const now = new Date().toISOString();
	const existingIndex = state.favorites.findIndex(
		(favorite) => favorite.user_id === userId && favorite.word === word.word,
	);

	let nextFavorites: WebFavoriteRow[];
	if (existingIndex >= 0) {
		nextFavorites = state.favorites.map((favorite, index) =>
			index === existingIndex
				? {
					...favorite,
					data: serialized,
					updated_at: now,
				}
				: favorite,
		);
	} else {
		const newFavorite: WebFavoriteRow = {
			id: generateWebFavoriteId(state.favorites),
			user_id: userId,
			word: word.word,
			data: serialized,
			created_at: now,
			updated_at: now,
		};
		nextFavorites = [newFavorite, ...state.favorites];
	}
	writeWebState({ ...state, favorites: nextFavorites });
}

async function removeFavoriteForUserNative(userId: number, word: string) {
	const db = await getDatabase();
	await db.runAsync("DELETE FROM favorites WHERE user_id = ? AND word = ?", [userId, word]);
}

async function removeFavoriteForUserWeb(userId: number, word: string) {
	const state = readWebState();
	const nextFavorites = state.favorites.filter(
		(favorite) => !(favorite.user_id === userId && favorite.word === word),
	);
	if (nextFavorites.length === state.favorites.length) {
		return;
	}
	writeWebState({ ...state, favorites: nextFavorites });
}

async function setGuestSessionNative() {
	const db = await getDatabase();
	await db.runAsync(
		`
			INSERT INTO session (id, is_guest, user_id, updated_at)
			VALUES (1, 1, NULL, CURRENT_TIMESTAMP)
			ON CONFLICT(id)
			DO UPDATE SET is_guest = excluded.is_guest, user_id = excluded.user_id, updated_at = CURRENT_TIMESTAMP
		`,
		[],
	);
}

async function setGuestSessionWeb() {
	const state = readWebState();
	const nextState: WebDatabaseState = {
		...state,
		session: {
			user_id: null,
			is_guest: 1,
			updated_at: new Date().toISOString(),
		},
	};
	writeWebState(nextState);
}

async function setUserSessionNative(userId: number) {
	const db = await getDatabase();
	await db.runAsync(
		`
			INSERT INTO session (id, is_guest, user_id, updated_at)
			VALUES (1, 0, ?, CURRENT_TIMESTAMP)
			ON CONFLICT(id)
			DO UPDATE SET is_guest = excluded.is_guest, user_id = excluded.user_id, updated_at = CURRENT_TIMESTAMP
		`,
		[userId],
	);
}

async function setUserSessionWeb(userId: number) {
	const state = readWebState();
	const nextState: WebDatabaseState = {
		...state,
		session: {
			user_id: userId,
			is_guest: 0,
			updated_at: new Date().toISOString(),
		},
	};
	writeWebState(nextState);
}

async function clearSessionNative() {
	const db = await getDatabase();
	await db.runAsync("DELETE FROM session WHERE id = 1", []);
}

async function clearSessionWebInternal() {
	const state = readWebState();
	if (!state.session) {
		return;
	}
	writeWebState({ ...state, session: null });
}

async function getActiveSessionNative(): Promise<{ isGuest: boolean; user: UserRecord | null } | null> {
	const db = await getDatabase();
	const rows = await db.getAllAsync<SessionRow>(
		"SELECT user_id, is_guest FROM session WHERE id = 1 LIMIT 1",
	);

	if (rows.length === 0) {
		return null;
	}

	const [session] = rows;
	if (session.is_guest) {
		return { isGuest: true, user: null };
	}

	if (session.user_id == null) {
		await clearSessionNative();
		return null;
	}

	const userRows = await db.getAllAsync<UserRow>(
		"SELECT id, username, display_name FROM users WHERE id = ? LIMIT 1",
		[session.user_id],
	);

	if (userRows.length === 0) {
		await clearSessionNative();
		return null;
	}

	return { isGuest: false, user: mapUserRow(userRows[0]) };
}

async function getActiveSessionWeb(): Promise<{ isGuest: boolean; user: UserRecord | null } | null> {
	const state = readWebState();
	const session = state.session;
	if (!session) {
		return null;
	}

	if (session.is_guest) {
		return { isGuest: true, user: null };
	}

	if (session.user_id == null) {
		await clearSessionWebInternal();
		return null;
	}

	const userRow = state.users.find((user) => user.id === session.user_id);
	if (!userRow) {
		await clearSessionWebInternal();
		return null;
	}

	return { isGuest: false, user: mapUserRow(userRow) };
}

export async function initializeDatabase() {
	if (isWeb) {
		return initializeDatabaseWeb();
	}
	return initializeDatabaseNative();
}

export async function findUserByUsername(username: string): Promise<UserWithPasswordRecord | null> {
	const normalizedUsername = username.trim();
	if (!normalizedUsername) {
		throw new Error("사용자 이름을 입력해주세요.");
	}

	if (isWeb) {
		return findUserByUsernameWeb(normalizedUsername);
	}
	return findUserByUsernameNative(normalizedUsername);
}

export async function createUser(username: string, password: string, displayName?: string) {
	const normalizedUsername = username.trim();
	if (!normalizedUsername) {
		throw new Error("사용자 이름을 입력해주세요.");
	}
	const normalizedDisplayName = displayName ?? normalizedUsername;

	if (isWeb) {
		return createUserWeb(normalizedUsername, password, normalizedDisplayName);
	}
	return createUserNative(normalizedUsername, password, normalizedDisplayName);
}

export async function updateUserDisplayName(userId: number, displayName: string | null) {
	if (isWeb) {
		return updateUserDisplayNameWeb(userId, displayName);
	}
	return updateUserDisplayNameNative(userId, displayName);
}

export async function getFavoritesByUser(userId: number) {
	if (isWeb) {
		return getFavoritesByUserWeb(userId);
	}
	return getFavoritesByUserNative(userId);
}

export async function upsertFavoriteForUser(userId: number, word: WordResult) {
	if (isWeb) {
		return upsertFavoriteForUserWeb(userId, word);
	}
	return upsertFavoriteForUserNative(userId, word);
}

export async function removeFavoriteForUser(userId: number, word: string) {
	if (isWeb) {
		return removeFavoriteForUserWeb(userId, word);
	}
	return removeFavoriteForUserNative(userId, word);
}

export async function setGuestSession() {
	if (isWeb) {
		return setGuestSessionWeb();
	}
	return setGuestSessionNative();
}

export async function setUserSession(userId: number) {
	if (isWeb) {
		return setUserSessionWeb(userId);
	}
	return setUserSessionNative(userId);
}

export async function clearSession() {
	if (isWeb) {
		return clearSessionWebInternal();
	}
	return clearSessionNative();
}

export async function getActiveSession(): Promise<{ isGuest: boolean; user: UserRecord | null } | null> {
	if (isWeb) {
		return getActiveSessionWeb();
	}
	return getActiveSessionNative();
}
