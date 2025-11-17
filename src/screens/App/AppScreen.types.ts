import type { LoginScreenProps } from "@/screens/Auth/LoginScreen.types";
import type { RootTabNavigatorProps } from "@/navigation/RootTabNavigator.types";
import type { ThemeMode } from "@/theme/types";

export type AppScreenHookResult = {
	versionLabel: string;
	initializing: boolean;
	isHelpVisible: boolean;
	isAuthenticated: boolean;
	loginBindings: LoginScreenProps;
	navigatorProps: RootTabNavigatorProps;
	onPasswordResetRequest: (email: string) => Promise<void>;
	handleDismissHelp: () => void;
	themeMode: ThemeMode;
	fontScale: number;
	onThemeModeChange: (mode: ThemeMode) => void;
	onFontScaleChange: (scale: number) => void;
};
