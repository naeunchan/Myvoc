import type { ThemeMode } from "@/theme/types";

export type SettingsScreenProps = {
	onLogout: () => void;
	canLogout: boolean;
	isGuest: boolean;
	onRequestLogin: () => void;
	onRequestSignUp: () => void;
	onShowHelp: () => void;
	appVersion: string;
	profileDisplayName: string | null;
	profileUsername: string | null;
	onNavigateProfile: () => void;
	themeMode: ThemeMode;
	onChangeThemeMode: (mode: ThemeMode) => void;
	fontScale: number;
	onChangeFontScale: (scale: number) => void;
};
