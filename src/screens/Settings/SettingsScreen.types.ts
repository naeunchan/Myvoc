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
};
