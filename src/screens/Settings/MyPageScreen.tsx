import React from "react";
import { Alert, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MISSING_USER_ERROR_MESSAGE } from "@/screens/App/AppScreen.constants";
import { createMyPageStyles } from "@/screens/Settings/MyPageScreen.styles";
import { useThemedStyles } from "@/theme/useThemedStyles";

type MyPageScreenProps = {
	username: string;
	displayName: string | null;
	onNavigateNickname: () => void;
	onNavigatePassword: () => void;
	onNavigateDeleteAccount: () => void;
};

export function MyPageScreen({
	username,
	displayName,
	onNavigateNickname,
	onNavigatePassword,
	onNavigateDeleteAccount,
}: MyPageScreenProps) {
	const styles = useThemedStyles(createMyPageStyles);

	const handleNavigateNickname = () => {
		if (!username) {
			Alert.alert("마이 페이지", MISSING_USER_ERROR_MESSAGE);
			return;
		}
		onNavigateNickname();
	};

	const handleNavigatePassword = () => {
		if (!username) {
			Alert.alert("마이 페이지", MISSING_USER_ERROR_MESSAGE);
			return;
		}
		onNavigatePassword();
	};

	const handleNavigateDeleteAccount = () => {
		if (!username) {
			Alert.alert("회원탈퇴", MISSING_USER_ERROR_MESSAGE);
			return;
		}
		onNavigateDeleteAccount();
	};

	return (
		<SafeAreaView style={styles.safeArea}>
			<ScrollView contentContainerStyle={styles.scrollContent}>
				<View style={styles.section}>
					<View style={styles.actionList}>
						<TouchableOpacity style={styles.actionItem} activeOpacity={0.85} onPress={handleNavigateNickname}>
							<View style={styles.actionTextContainer}>
								<Text style={styles.actionTitle}>닉네임 수정</Text>
							</View>
							<Text style={styles.actionChevron}>›</Text>
						</TouchableOpacity>
						<View style={styles.actionDivider} />
						<TouchableOpacity style={styles.actionItem} activeOpacity={0.85} onPress={handleNavigatePassword}>
							<View style={styles.actionTextContainer}>
								<Text style={styles.actionTitle}>비밀번호 변경</Text>
							</View>
							<Text style={styles.actionChevron}>›</Text>
						</TouchableOpacity>
					</View>
					<View style={styles.deleteCard}>
						<Text style={styles.deleteDescription}>회원탈퇴를 진행하면 앱에 저장된 모든 데이터와 쿠키가 삭제돼요.</Text>
						<TouchableOpacity style={styles.deleteButton} onPress={handleNavigateDeleteAccount}>
							<Text style={styles.deleteButtonText}>회원탈퇴 진행하기</Text>
						</TouchableOpacity>
					</View>
				</View>
			</ScrollView>
		</SafeAreaView>
	);
}
