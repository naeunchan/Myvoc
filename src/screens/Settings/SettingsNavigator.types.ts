export type SettingsStackParamList = {
	SettingsHome: undefined;
	MyPage: undefined;
	MyPageNickname: undefined;
	MyPagePassword: undefined;
};

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
};
