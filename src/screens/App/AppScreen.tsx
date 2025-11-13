import React, { useMemo } from "react";
import { View } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { LoadingState } from "@/components/LoadingState";
import { LoginScreen } from "@/screens/Auth/LoginScreen";
import { AppNavigator } from "@/components/AppNavigator";
import { AppHelpModal } from "@/components/AppHelpModal";
import { INITIAL_LOADING_MESSAGE } from "@/screens/App/AppScreen.constants";
import { useAppScreen } from "@/hooks/useAppScreen";
import { AppAppearanceProvider } from "@/theme/AppearanceContext";
import { createAppScreenStyles } from "@/screens/App/AppScreen.styles";
import { APP_THEMES } from "@/theme/themes";

export function AppScreen() {
	const {
		initializing,
		isHelpVisible,
		isAuthenticated,
		loginBindings,
		navigatorProps,
		handleDismissHelp,
		themeMode,
		fontScale,
		onThemeModeChange,
		onFontScaleChange,
	} = useAppScreen();
	const styles = useMemo(() => createAppScreenStyles(APP_THEMES[themeMode]), [themeMode]);

	return (
		<AppAppearanceProvider
			mode={themeMode}
			fontScale={fontScale}
			onChangeMode={onThemeModeChange}
			onChangeFontScale={onFontScaleChange}
		>
			<SafeAreaProvider>
				<StatusBar style={themeMode === "dark" ? "light" : "dark"} />
				<View style={styles.container}>
					<View style={styles.content}>
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
		</AppAppearanceProvider>
	);
}
