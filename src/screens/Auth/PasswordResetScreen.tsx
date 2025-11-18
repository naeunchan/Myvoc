import React, { useCallback, useState } from "react";
import { ActivityIndicator, KeyboardAvoidingView, Platform, Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useThemedStyles } from "@/theme/useThemedStyles";
import { createPasswordResetScreenStyles } from "@/screens/Auth/PasswordResetScreen.styles";
import { PasswordResetScreenProps } from "@/screens/Auth/PasswordResetScreen.types";
import {
	PASSWORD_RESET_INPUT_ERROR_MESSAGE,
	PASSWORD_RESET_SOCIAL_NOTE,
	PASSWORD_RESET_SUCCESS_MESSAGE,
} from "@/screens/App/AppScreen.constants";

export function PasswordResetScreen({ initialEmail = "", onSubmit, onDone }: PasswordResetScreenProps) {
	const styles = useThemedStyles(createPasswordResetScreenStyles);
	const [email, setEmail] = useState(initialEmail);
	const [error, setError] = useState<string | null>(null);
	const [submitting, setSubmitting] = useState(false);
	const [hasSent, setHasSent] = useState(false);

	const handleSubmit = useCallback(async () => {
		if (submitting) {
			return;
		}
		const normalizedEmail = email.trim();
		if (!normalizedEmail) {
			setError(PASSWORD_RESET_INPUT_ERROR_MESSAGE);
			return;
		}
		setSubmitting(true);
		setError(null);
		try {
			await onSubmit(normalizedEmail);
			setHasSent(true);
		} catch (submitError) {
			const message = submitError instanceof Error ? submitError.message : "비밀번호 재설정 메일을 보내지 못했어요.";
			setError(message);
			setHasSent(false);
		} finally {
			setSubmitting(false);
		}
	}, [email, onSubmit, submitting]);

	return (
		<SafeAreaView style={styles.safeArea}>
			<KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.select({ ios: "padding", default: undefined })}>
				<View style={styles.content}>
					<View style={styles.header}>
						<Text style={styles.title}>비밀번호 재설정</Text>
						<Text style={styles.description}>가입한 이메일 주소로 비밀번호 재설정 링크를 보내드릴게요.</Text>
					</View>

					<TextInput
						style={styles.textInput}
						value={email}
						onChangeText={setEmail}
						autoCapitalize="none"
						autoCorrect={false}
						keyboardType="email-address"
						editable={!submitting}
						placeholder="example@email.com"
						returnKeyType="done"
						onSubmitEditing={handleSubmit}
					/>

					{error ? <Text style={styles.errorText}>{error}</Text> : null}

					{hasSent ? (
						<View style={styles.successCard}>
							<Text style={styles.successText}>{PASSWORD_RESET_SUCCESS_MESSAGE}</Text>
						</View>
					) : (
						<Text style={styles.helperText}>재설정 링크는 10분 동안 유효해요. 메일함(스팸함 포함)을 꼭 확인해주세요.</Text>
					)}

					<View style={styles.noticeCard}>
						<Text style={styles.noticeTitle}>소셜 로그인 이용 중인가요?</Text>
						<Text style={styles.noticeText}>{PASSWORD_RESET_SOCIAL_NOTE}</Text>
					</View>

					<View style={styles.actions}>
						<TouchableOpacity
							style={[styles.primaryButton, submitting && styles.buttonDisabled]}
							onPress={handleSubmit}
							disabled={submitting}
							accessibilityRole="button"
						>
							{submitting ? (
								<ActivityIndicator color="#ffffff" />
							) : (
								<Text style={styles.primaryButtonText}>{hasSent ? "다시 보내기" : "재설정 링크 보내기"}</Text>
							)}
						</TouchableOpacity>

						<TouchableOpacity style={styles.secondaryButton} onPress={onDone} accessibilityRole="button">
							<Text style={styles.secondaryButtonText}>로그인 화면으로 돌아가기</Text>
						</TouchableOpacity>
					</View>
				</View>
			</KeyboardAvoidingView>
		</SafeAreaView>
	);
}
