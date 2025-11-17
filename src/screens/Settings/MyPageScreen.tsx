import React, { useCallback, useState } from "react";
import { Alert, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
	ACCOUNT_DELETION_CONFIRM_MESSAGE,
	ACCOUNT_DELETION_ERROR_MESSAGE,
	ACCOUNT_DELETION_SUCCESS_MESSAGE,
	MISSING_USER_ERROR_MESSAGE,
} from "@/screens/App/AppScreen.constants";
import { createMyPageStyles } from "@/screens/Settings/MyPageScreen.styles";
import { useThemedStyles } from "@/theme/useThemedStyles";

type MyPageScreenProps = {
	username: string;
	displayName: string | null;
	onNavigateNickname: () => void;
	onNavigatePassword: () => void;
	onDeleteAccount: () => Promise<void>;
};

export function MyPageScreen({ username, displayName, onNavigateNickname, onNavigatePassword, onDeleteAccount }: MyPageScreenProps) {
	const styles = useThemedStyles(createMyPageStyles);
	const [deleting, setDeleting] = useState(false);

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

	const executeAccountDeletion = useCallback(async () => {
		if (!username) {
			Alert.alert("회원탈퇴", MISSING_USER_ERROR_MESSAGE);
			return;
		}
		setDeleting(true);
		try {
			await onDeleteAccount();
			Alert.alert("회원탈퇴 완료", ACCOUNT_DELETION_SUCCESS_MESSAGE);
		} catch (error) {
			const message = error instanceof Error ? error.message : ACCOUNT_DELETION_ERROR_MESSAGE;
			Alert.alert("회원탈퇴", message);
		} finally {
			setDeleting(false);
		}
	}, [onDeleteAccount, username]);

	const handleDeleteAccount = useCallback(() => {
		if (deleting) {
			return;
		}
		Alert.alert("회원탈퇴", ACCOUNT_DELETION_CONFIRM_MESSAGE, [
			{ text: "취소", style: "cancel" },
			{ text: "모두 삭제하고 탈퇴", style: "destructive", onPress: () => {
				void executeAccountDeletion();
			} },
		]);
	}, [deleting, executeAccountDeletion]);

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
						<TouchableOpacity
							style={[styles.deleteButton, deleting && styles.deleteButtonDisabled]}
							onPress={handleDeleteAccount}
							disabled={deleting}
						>
							<Text style={styles.deleteButtonText}>{deleting ? "탈퇴 처리 중..." : "회원탈퇴"}</Text>
						</TouchableOpacity>
					</View>
				</View>
			</ScrollView>
		</SafeAreaView>
	);
}
