export type SettingsStackParamList = {
	SettingsHome: undefined;
	MyPage: undefined;
	MyPageNickname: undefined;
	MyPagePassword: undefined;
};

import type { ThemeMode } from "@/theme/types";

export type SettingsNavigatorProps = {
	onLogout: () => void;
	canLogout: boolean;
	isGuest: boolean;
	onRequestLogin: () => void;
	onRequestSignUp: () => void;
	onShowHelp: () => void;
	appVersion: string;
	profileDisplayName: string | null;
	profileUsername: string | null;
	onUpdateProfile: (displayName: string) => Promise<void>;
	onUpdatePassword: (password: string) => Promise<void>;
	themeMode: ThemeMode;
	onThemeModeChange: (mode: ThemeMode) => void;
	fontScale: number;
	onFontScaleChange: (scale: number) => void;
};
