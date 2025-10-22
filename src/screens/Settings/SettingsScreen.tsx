import React, { useCallback } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Text, TouchableOpacity, View } from "react-native";
import { SettingsScreenProps } from "@/screens/Settings/SettingsScreen.types";
import { styles } from "@/screens/Settings/SettingsScreen.styles";
import { GuestActionCard } from "@/screens/Settings/components/GuestActionCard";
import { AuthenticatedActions } from "@/screens/Settings/components/AuthenticatedActions";

export function SettingsScreen({ onLogout, canLogout, isGuest, onRequestLogin, onRequestSignUp, onShowHelp, appVersion }: SettingsScreenProps) {
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
				<TouchableOpacity style={styles.helpButton} onPress={onShowHelp} activeOpacity={0.9}>
					<Text style={styles.helpButtonText}>도움말 다시 보기</Text>
					<Text style={styles.helpButtonHint}>앱 사용 방법 안내를 다시 확인할 수 있어요.</Text>
				</TouchableOpacity>
				<View style={styles.versionCard}>
					<Text style={styles.versionLabel}>앱 버전</Text>
					<Text style={styles.versionValue}>{appVersion}</Text>
				</View>
				{isGuest ? <GuestActionCard onSignUp={handleSignUpPress} onLogin={handleLoginPress} /> : <AuthenticatedActions canLogout={canLogout} onLogout={handleLogoutPress} onNavigateHome={onLogout} />}
			</View>
		</SafeAreaView>
	);
}
