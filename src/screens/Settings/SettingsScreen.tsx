import React, { useCallback } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Text, TouchableOpacity, View } from "react-native";
import { SettingsScreenProps } from "@/screens/Settings/SettingsScreen.types";
import { styles } from "@/screens/Settings/SettingsScreen.styles";

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

	const handleGoToLoginPress = useCallback(() => {
		onLogout();
	}, [onLogout]);

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
					<View style={styles.guestCard}>
						<Text style={styles.guestTitle}>게스트 모드로 이용 중이에요.</Text>
						<Text style={styles.guestDescription}>
							계정을 생성하거나 로그인하면 단어 저장 개수 제한 없이 모든 기능을 사용할 수 있어요.
						</Text>
						<TouchableOpacity style={styles.primaryCta} onPress={handleSignUpPress} activeOpacity={0.9}>
							<Text style={styles.primaryCtaText}>회원가입 후 계속하기</Text>
						</TouchableOpacity>
						<TouchableOpacity style={styles.secondaryCta} onPress={handleLoginPress} activeOpacity={0.9}>
							<Text style={styles.secondaryCtaText}>기존 계정으로 로그인</Text>
						</TouchableOpacity>
					</View>
				) : (
					<>
						{canLogout ? (
							<TouchableOpacity style={styles.logoutButton} onPress={handleLogoutPress} activeOpacity={0.9}>
								<Text style={styles.logoutButtonText}>로그아웃</Text>
							</TouchableOpacity>
						) : null}
						<TouchableOpacity style={styles.homeButton} onPress={handleGoToLoginPress} activeOpacity={0.9}>
							<Text style={styles.homeButtonText}>초기 화면으로 이동</Text>
						</TouchableOpacity>
					</>
				)}
			</View>
		</SafeAreaView>
	);
}
