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
		<View style={styles.section}>
			<Text style={styles.sectionLabel}>계정</Text>
			<View style={styles.sectionCard}>
				<TouchableOpacity style={[styles.row, styles.rowBorder]} activeOpacity={0.6} onPress={onNavigateHome}>
					<Text style={styles.rowLabel}>초기 화면으로 이동</Text>
					<Text style={styles.rowChevron}>›</Text>
				</TouchableOpacity>
				{canLogout ? (
					<TouchableOpacity style={styles.row} activeOpacity={0.6} onPress={onLogout}>
						<Text style={[styles.rowLabel, styles.rowDangerText]}>로그아웃</Text>
						<Text style={[styles.rowChevron, styles.rowDangerText]}>›</Text>
					</TouchableOpacity>
				) : null}
			</View>
		</View>
	);
}
