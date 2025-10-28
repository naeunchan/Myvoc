import React from "react";
import { Alert, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MISSING_USER_ERROR_MESSAGE } from "@/app/App/AppScreen.constants";
import { myPageStyles as styles } from "@/screens/Settings/MyPageScreen.styles";

type MyPageScreenProps = {
	username: string;
	displayName: string | null;
	onNavigateNickname: () => void;
	onNavigatePassword: () => void;
};

export function MyPageScreen({ username, displayName, onNavigateNickname, onNavigatePassword }: MyPageScreenProps) {
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
				</View>
			</ScrollView>
		</SafeAreaView>
	);
}
