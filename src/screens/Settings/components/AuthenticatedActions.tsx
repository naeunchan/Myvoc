import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { styles } from "@/screens/Settings/SettingsScreen.styles";

type AuthenticatedActionsProps = {
	canLogout: boolean;
	onLogout: () => void;
	onNavigateHome: () => void;
	onNavigateProfile: () => void;
};

export function AuthenticatedActions({ canLogout, onLogout, onNavigateHome, onNavigateProfile }: AuthenticatedActionsProps) {
	return (
		<View style={styles.authenticatedActionsContainer}>
			<TouchableOpacity style={styles.profileButton} onPress={onNavigateProfile} activeOpacity={0.9}>
				<Text style={styles.profileButtonTitle}>마이 페이지</Text>
				<Text style={styles.profileButtonDescription}>내 정보와 학습 통계를 확인할 수 있어요.</Text>
			</TouchableOpacity>
			<View style={styles.accountActions}>
			{canLogout ? (
				<TouchableOpacity style={styles.logoutButton} onPress={onLogout} activeOpacity={0.9}>
					<Text style={styles.logoutButtonText}>로그아웃</Text>
				</TouchableOpacity>
			) : null}
			<TouchableOpacity style={styles.homeButton} onPress={onNavigateHome} activeOpacity={0.9}>
				<Text style={styles.homeButtonText}>초기 화면으로 이동</Text>
			</TouchableOpacity>
			</View>
		</View>
	);
}
