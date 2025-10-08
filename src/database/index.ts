import { openDatabaseAsync, type SQLiteDatabase } from "expo-sqlite";
import type { WordResult } from "@/features/dictionary/types";

const DATABASE_NAME = "myvoc.db";

type UserRow = {
	id: number;
	username: string;
	display_name: string | null;
	password_hash: string | null;
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
	if (!databasePromise) {
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

export async function findUserByUsername(username: string): Promise<UserWithPasswordRecord | null> {
	const normalizedUsername = username.trim();
	if (!normalizedUsername) {
		throw new Error("사용자 이름을 입력해주세요.");
	}
	const db = await getDatabase();
	const rows = await db.getAllAsync<UserRow>(
		"SELECT id, username, display_name, password_hash FROM users WHERE username = ? LIMIT 1",
		[normalizedUsername],
	);

	if (rows.length === 0) {
		return null;
	}

	return mapUserRowWithPassword(rows[0]);
}

export async function createUser(username: string, password: string, displayName?: string) {
	const normalizedUsername = username.trim();
	if (!normalizedUsername) {
		throw new Error("사용자 이름을 입력해주세요.");
	}
	const normalizedDisplayName = (displayName ?? normalizedUsername).trim() || normalizedUsername;
	const passwordHash = await hashPassword(password);
	const db = await getDatabase();

	await db.runAsync("INSERT INTO users (username, display_name, password_hash) VALUES (?, ?, ?)", [
		normalizedUsername,
		normalizedDisplayName,
		passwordHash,
	]);

	const inserted = await db.getAllAsync<UserRow>(
		"SELECT id, username, display_name, password_hash FROM users WHERE username = ? LIMIT 1",
		[normalizedUsername],
	);
	if (inserted.length === 0) {
		throw new Error("사용자 정보를 생성하지 못했어요.");
	}

	return mapUserRow(inserted[0], normalizedDisplayName);
}

export async function initializeDatabase() {
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

export async function updateUserDisplayName(userId: number, displayName: string | null) {
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

export async function getFavoritesByUser(userId: number) {
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

export async function upsertFavoriteForUser(userId: number, word: WordResult) {
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

export async function removeFavoriteForUser(userId: number, word: string) {
	const db = await getDatabase();
	await db.runAsync("DELETE FROM favorites WHERE user_id = ? AND word = ?", [userId, word]);
}

type SessionRow = {
	user_id: number | null;
	is_guest: number;
};

export async function setGuestSession() {
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

export async function setUserSession(userId: number) {
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

export async function clearSession() {
	const db = await getDatabase();
	await db.runAsync("DELETE FROM session WHERE id = 1", []);
}

export async function getActiveSession(): Promise<{ isGuest: boolean; user: UserRecord | null } | null> {
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
		await clearSession();
		return null;
	}

	const userRows = await db.getAllAsync<UserRow>(
		"SELECT id, username, display_name FROM users WHERE id = ? LIMIT 1",
		[session.user_id],
	);

	if (userRows.length === 0) {
		await clearSession();
		return null;
	}

	return { isGuest: false, user: mapUserRow(userRows[0]) };
}
