import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { styles } from "@/screens/Settings/SettingsScreen.styles";

type AuthenticatedActionsProps = {
	canLogout: boolean;
	onLogout: () => void;
	onNavigateHome: () => void;
};

export function AuthenticatedActions({ canLogout, onLogout, onNavigateHome }: AuthenticatedActionsProps) {
	return (
		<View>
			{canLogout ? (
				<TouchableOpacity style={styles.logoutButton} onPress={onLogout} activeOpacity={0.9}>
					<Text style={styles.logoutButtonText}>로그아웃</Text>
				</TouchableOpacity>
			) : null}
			<TouchableOpacity style={styles.homeButton} onPress={onNavigateHome} activeOpacity={0.9}>
				<Text style={styles.homeButtonText}>초기 화면으로 이동</Text>
			</TouchableOpacity>
		</View>
	);
}
