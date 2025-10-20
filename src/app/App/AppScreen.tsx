import React from "react";
import { View } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { BannerPlaceholder } from "@/app/components/BannerPlaceholder";
import { VersionBadge } from "@/app/components/VersionBadge";
import { LoadingState } from "@/app/components/LoadingState";
import { LoginScreen } from "@/screens/Auth/LoginScreen";
import { AppNavigator } from "@/app/components/AppNavigator";
import { AppHelpModal } from "@/app/components/AppHelpModal";
import { INITIAL_LOADING_MESSAGE } from "@/app/App/AppScreen.constants";
import { useAppScreen } from "@/app/App/AppScreen.hooks";
import { appScreenStyles as styles } from "@/app/App/AppScreen.styles";

export function AppScreen() {
	const { versionLabel, initializing, isHelpVisible, isAuthenticated, loginBindings, navigatorProps, handleDismissHelp } =
		useAppScreen();

	return (
		<SafeAreaProvider>
			<StatusBar style="dark" />
			<View style={styles.container}>
				<BannerPlaceholder />
				<View style={styles.content}>
					<VersionBadge label={versionLabel} />
					{initializing ? (
						<LoadingState message={INITIAL_LOADING_MESSAGE} />
					) : !isAuthenticated ? (
						<LoginScreen {...loginBindings} />
					) : (
						<AppNavigator {...navigatorProps} />
					)}
				</View>
			</View>
			<AppHelpModal visible={isHelpVisible} onDismiss={handleDismissHelp} />
		</SafeAreaProvider>
	);
}
