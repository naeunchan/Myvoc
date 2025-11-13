import React, { useCallback, useEffect, useState } from "react";
import { ActivityIndicator, Alert, ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MISSING_USER_ERROR_MESSAGE, PROFILE_UPDATE_ERROR_MESSAGE, PROFILE_UPDATE_SUCCESS_MESSAGE } from "@/screens/App/AppScreen.constants";
import { createMyPageStyles } from "@/screens/Settings/MyPageScreen.styles";
import { useThemedStyles } from "@/theme/useThemedStyles";
import { useAppAppearance } from "@/theme/AppearanceContext";

type MyPageNicknameScreenProps = {
	username: string;
	displayName: string | null;
	onUpdateProfile: (displayName: string) => Promise<void>;
	onGoBack: () => void;
};

export function MyPageNicknameScreen({ username, displayName, onUpdateProfile, onGoBack }: MyPageNicknameScreenProps) {
	const styles = useThemedStyles(createMyPageStyles);
	const { theme } = useAppAppearance();
	const [nickname, setNickname] = useState(displayName ?? "");
	const [error, setError] = useState<string | null>(null);
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		setNickname(displayName ?? "");
	}, [displayName]);

	const handleSubmit = useCallback(async () => {
		if (loading) {
			return;
		}

		if (!username) {
			Alert.alert("마이 페이지", MISSING_USER_ERROR_MESSAGE);
			return;
		}

		setLoading(true);
		setError(null);
		try {
			await onUpdateProfile(nickname);
			Alert.alert("마이 페이지", PROFILE_UPDATE_SUCCESS_MESSAGE, [
				{
					text: "확인",
					onPress: onGoBack,
				},
			]);
		} catch (error) {
			const message = error instanceof Error ? error.message : PROFILE_UPDATE_ERROR_MESSAGE;
			setError(message);
		} finally {
			setLoading(false);
		}
	}, [loading, nickname, onGoBack, onUpdateProfile, username]);

	return (
		<SafeAreaView style={styles.safeArea}>
			<ScrollView contentContainerStyle={styles.scrollContent}>
				<View style={styles.section}>
					<Text style={styles.title}>닉네임 설정</Text>
					<Text style={styles.sectionDescription}>닉네임을 비워두면 아이디가 대신 표시돼요.</Text>
					<TextInput
						style={styles.input}
						placeholder="닉네임을 입력하세요"
						value={nickname}
						onChangeText={setNickname}
						editable={!loading}
						placeholderTextColor={theme.textMuted}
						autoCapitalize="none"
						returnKeyType="done"
					/>
					{error ? <Text style={styles.errorText}>{error}</Text> : null}
					<TouchableOpacity style={[styles.submitButton, loading && styles.submitButtonDisabled]} onPress={handleSubmit} disabled={loading} activeOpacity={0.9}>
						{loading ? <ActivityIndicator color={theme.accentContrast} /> : <Text style={styles.submitButtonText}>저장</Text>}
					</TouchableOpacity>
				</View>
			</ScrollView>
		</SafeAreaView>
	);
}
