import React from "react";
import { ActivityIndicator, Text, TextInput, TouchableOpacity, View } from "react-native";
import { createLoginScreenStyles } from "@/screens/Auth/LoginScreen.styles";
import { useThemedStyles } from "@/theme/useThemedStyles";
import { useAppAppearance } from "@/theme/AppearanceContext";

type VerificationStatus = "idle" | "sent" | "verified";

type EmailVerificationSectionProps = {
	status: VerificationStatus;
	code: string;
	errorMessage: string | null;
	hintMessage: string | null;
	sending: boolean;
	verifying: boolean;
	canSend: boolean;
	canVerify: boolean;
	disabled: boolean;
	onChangeCode: (value: string) => void;
	onSendCode: () => void;
	onVerifyCode: () => void;
};

export function EmailVerificationSection({
	status,
	code,
	errorMessage,
	hintMessage,
	sending,
	verifying,
	canSend,
	canVerify,
	disabled,
	onChangeCode,
	onSendCode,
	onVerifyCode,
}: EmailVerificationSectionProps) {
	const styles = useThemedStyles(createLoginScreenStyles);
	const { theme } = useAppAppearance();
	const sendDisabled = disabled || sending || !canSend || status === "verified";
	const verifyDisabled = disabled || verifying || !canVerify || status === "verified";
	const sendLabel = status === "sent" ? "인증 메일 재전송" : "인증 메일 보내기";
	const verifyLabel = status === "verified" ? "인증 완료" : "인증 확인";

	return (
		<View style={styles.verificationSection}>
			<View style={styles.verificationHeaderRow}>
				<Text style={styles.inputLabel}>이메일 인증</Text>
				<TouchableOpacity
					style={[styles.verificationSendButton, sendDisabled && styles.disabledButton]}
					onPress={onSendCode}
					disabled={sendDisabled}
					activeOpacity={0.8}
				>
					{sending ? (
						<ActivityIndicator size="small" color={theme.accent} />
					) : (
						<Text style={styles.verificationSendButtonText}>{sendLabel}</Text>
					)}
				</TouchableOpacity>
			</View>
			<Text style={styles.verificationDescription}>가입 시 사용할 이메일 주소로 받은 인증 코드를 입력해주세요.</Text>
			<TextInput
				style={[styles.textInput, styles.verificationCodeInput]}
				value={code}
				onChangeText={onChangeCode}
				placeholder="6자리 인증 코드를 입력하세요"
				editable={!disabled && status !== "verified"}
				keyboardType="number-pad"
				returnKeyType="done"
				autoCorrect={false}
				placeholderTextColor={theme.textMuted}
			/>
			<TouchableOpacity
				style={[
					styles.verificationActionButton,
					verifyDisabled && styles.verificationActionButtonDisabled,
				]}
				onPress={onVerifyCode}
				disabled={verifyDisabled}
				activeOpacity={0.85}
			>
				{verifying ? (
					<ActivityIndicator size="small" color={theme.accentContrast} />
				) : (
					<Text style={styles.verificationActionButtonText}>{verifyLabel}</Text>
				)}
			</TouchableOpacity>
			{errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}
			{status === "verified" ? (
				<Text style={styles.verificationSuccessText}>이메일 인증이 완료되었어요.</Text>
			) : hintMessage ? (
				<Text style={styles.verificationHintText}>{hintMessage}</Text>
			) : null}
		</View>
	);
}
