import type { LoginScreenProps } from "@/screens/Auth/LoginScreen.types";
import type { RootTabNavigatorProps } from "@/navigation/RootTabNavigator.types";

export type AppScreenHookResult = {
	versionLabel: string;
	initializing: boolean;
	isHelpVisible: boolean;
	isAuthenticated: boolean;
	loginBindings: LoginScreenProps;
	navigatorProps: RootTabNavigatorProps;
	handleDismissHelp: () => void;
};
