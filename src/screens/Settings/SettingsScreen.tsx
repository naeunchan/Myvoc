import React, { useCallback } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Text, View } from "react-native";
import { SettingsScreenProps } from "@/screens/Settings/SettingsScreen.types";
import { styles } from "@/screens/Settings/SettingsScreen.styles";
import { GuestActionCard } from "@/screens/Settings/components/GuestActionCard";
import { AuthenticatedActions } from "@/screens/Settings/components/AuthenticatedActions";

export function SettingsScreen({
	onLogout,
	canLogout,
	isGuest,
	onRequestLogin,
	onRequestSignUp,
}: SettingsScreenProps) {
	const handleLogoutPress = useCallback(() => {
		if (!canLogout) {
			return;
		}
		onLogout();
	}, [canLogout, onLogout]);

	const handleLoginPress = useCallback(() => {
		if (!isGuest) {
			return;
		}
		onRequestLogin();
	}, [isGuest, onRequestLogin]);

	const handleSignUpPress = useCallback(() => {
		if (!isGuest) {
			return;
		}
		onRequestSignUp();
	}, [isGuest, onRequestSignUp]);

	return (
		<SafeAreaView style={styles.safeArea}>
			<View style={styles.content}>
				<Text style={styles.title}>설정</Text>
				<Text style={styles.description}>계정을 관리하고 초기 화면으로 돌아갈 수 있어요.</Text>
				{isGuest ? (
					<GuestActionCard onSignUp={handleSignUpPress} onLogin={handleLoginPress} />
				) : (
					<AuthenticatedActions
						canLogout={canLogout}
						onLogout={handleLogoutPress}
						onNavigateHome={onLogout}
					/>
				)}
			</View>
		</SafeAreaView>
	);
}
