export type SettingsScreenProps = {
	onLogout: () => void;
	canLogout: boolean;
	isGuest: boolean;
	onRequestLogin: () => void;
	onRequestSignUp: () => void;
	onShowHelp: () => void;
};
