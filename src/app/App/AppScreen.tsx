import React from "react";
import { View } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { LoadingState } from "@/app/components/LoadingState";
import { LoginScreen } from "@/screens/Auth/LoginScreen";
import { AppNavigator } from "@/app/components/AppNavigator";
import { AppHelpModal } from "@/app/components/AppHelpModal";
import { INITIAL_LOADING_MESSAGE } from "@/app/App/AppScreen.constants";
import { useAppScreen } from "@/app/App/AppScreen.hooks";
import { appScreenStyles as styles } from "@/app/App/AppScreen.styles";

export function AppScreen() {
	const { initializing, isHelpVisible, isAuthenticated, loginBindings, navigatorProps, handleDismissHelp } = useAppScreen();

	return (
		<SafeAreaProvider>
			<StatusBar style="dark" />
			<View style={styles.container}>
				<View style={styles.content}>
					{initializing ? <LoadingState message={INITIAL_LOADING_MESSAGE} /> : !isAuthenticated ? <LoginScreen {...loginBindings} /> : <AppNavigator {...navigatorProps} />}
				</View>
			</View>
			<AppHelpModal visible={isHelpVisible} onDismiss={handleDismissHelp} />
		</SafeAreaProvider>
	);
}
