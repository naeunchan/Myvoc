import React, { useCallback } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Text, TouchableOpacity, View } from "react-native";
import { SettingsScreenProps } from "@/screens/Settings/SettingsScreen.types";
import { styles } from "@/screens/Settings/SettingsScreen.styles";

export function SettingsScreen({ onLogout, canLogout }: SettingsScreenProps) {
	const handleLogoutPress = useCallback(() => {
		if (!canLogout) {
			return;
		}
		onLogout();
	}, [canLogout, onLogout]);

	const handleGoToLoginPress = useCallback(() => {
		onLogout();
	}, [onLogout]);

	return (
		<SafeAreaView style={styles.safeArea}>
			<View style={styles.content}>
				<Text style={styles.title}>설정</Text>
				<Text style={styles.description}>계정을 관리하고 초기 화면으로 돌아갈 수 있어요.</Text>
				{canLogout ? (
					<TouchableOpacity style={styles.logoutButton} onPress={handleLogoutPress} activeOpacity={0.9}>
						<Text style={styles.logoutButtonText}>로그아웃</Text>
					</TouchableOpacity>
				) : null}
				<TouchableOpacity style={styles.homeButton} onPress={handleGoToLoginPress} activeOpacity={0.9}>
					<Text style={styles.homeButtonText}>초기 화면으로 이동</Text>
				</TouchableOpacity>
			</View>
		</SafeAreaView>
	);
}
