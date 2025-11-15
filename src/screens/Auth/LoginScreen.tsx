import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Alert, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { createLoginScreenStyles } from "@/screens/Auth/LoginScreen.styles";
import { LoginScreenProps } from "@/screens/Auth/LoginScreen.types";
import { LoginHeader } from "@/screens/Auth/components/LoginHeader";
import { CredentialFields } from "@/screens/Auth/components/CredentialFields";
import { RememberMeToggle } from "@/screens/Auth/components/RememberMeToggle";
import { PrimaryActionButton } from "@/screens/Auth/components/PrimaryActionButton";
import { GuestButton } from "@/screens/Auth/components/GuestButton";
import { AuthModeSwitch } from "@/screens/Auth/components/AuthModeSwitch";
import { ForgotPasswordModal } from "@/screens/Auth/components/ForgotPasswordModal";
import { SocialLoginButtons } from "@/screens/Auth/components/SocialLoginButtons";
import { getLoginCopy } from "@/screens/Auth/constants/loginCopy";
import { useThemedStyles } from "@/theme/useThemedStyles";
import { PASSWORD_RESET_INPUT_ERROR_MESSAGE, PASSWORD_RESET_SUCCESS_MESSAGE } from "@/screens/App/AppScreen.constants";

export function LoginScreen({ onLogin, onSignUp, onGuest, onSocialLogin, onResetPassword, loading = false, errorMessage, initialMode = "login" }: LoginScreenProps) {
	const styles = useThemedStyles(createLoginScreenStyles);
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [displayName, setDisplayName] = useState("");
	const [mode, setMode] = useState<"login" | "signup">(initialMode);
	const [rememberMe, setRememberMe] = useState(false);
	const [resetVisible, setResetVisible] = useState(false);
	const [resetEmail, setResetEmail] = useState("");
	const [resetError, setResetError] = useState<string | null>(null);
	const [resetLoading, setResetLoading] = useState(false);

	useEffect(() => {
		setMode(initialMode);
		setUsername("");
		setPassword("");
		setDisplayName("");
	}, [initialMode]);

	const trimmedUsername = useMemo(() => username.trim(), [username]);
	const trimmedPassword = useMemo(() => password.trim(), [password]);
	const trimmedDisplayName = useMemo(() => displayName.trim(), [displayName]);

	const copy = useMemo(() => getLoginCopy(mode), [mode]);
	const isPrimaryDisabled = loading || trimmedUsername.length === 0 || trimmedPassword.length === 0;

	const handlePrimaryPress = useCallback(() => {
		if (isPrimaryDisabled) {
			return;
		}

		if (mode === "login") {
			onLogin(trimmedUsername, trimmedPassword, { rememberMe });
			return;
		}

		onSignUp(trimmedUsername, trimmedPassword, trimmedDisplayName, { rememberMe });
	}, [isPrimaryDisabled, mode, onLogin, onSignUp, rememberMe, trimmedDisplayName, trimmedPassword, trimmedUsername]);

	const handleGuestPress = useCallback(() => {
		if (!loading) {
			onGuest();
		}
	}, [loading, onGuest]);

	const handleToggleMode = useCallback(() => {
		if (loading) {
			return;
		}
		setMode((previous) => (previous === "login" ? "signup" : "login"));
		setPassword("");
		setDisplayName("");
	}, [loading]);

	const handleOpenReset = useCallback(() => {
		setResetVisible(true);
		setResetEmail("");
		setResetError(null);
	}, []);

	const handleCloseReset = useCallback(() => {
		if (resetLoading) {
			return;
		}
		setResetVisible(false);
		setResetError(null);
	}, [resetLoading]);

	const handleSubmitReset = useCallback(async () => {
		if (resetLoading) {
			return;
		}
		const trimmedEmail = resetEmail.trim();
		if (!trimmedEmail) {
			setResetError(PASSWORD_RESET_INPUT_ERROR_MESSAGE);
			return;
		}
		setResetLoading(true);
		setResetError(null);
		try {
			await onResetPassword(trimmedEmail);
			Alert.alert("이메일 인증 안내", PASSWORD_RESET_SUCCESS_MESSAGE, [{ text: "확인", onPress: handleCloseReset }]);
		} catch (error) {
			const message = error instanceof Error ? error.message : "인증 메일을 보내지 못했어요.";
			setResetError(message);
		} finally {
			setResetLoading(false);
		}
	}, [handleCloseReset, onResetPassword, resetEmail, resetLoading]);

	return (
		<SafeAreaView style={styles.safeArea}>
			<View style={styles.content}>
				<LoginHeader title={copy.title} subtitle={copy.subtitle} />

				{errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}

				<CredentialFields
					mode={mode}
					username={username}
					password={password}
					displayName={displayName}
					loading={loading}
					onChangeUsername={setUsername}
					onChangePassword={setPassword}
					onChangeDisplayName={setDisplayName}
				/>

				<RememberMeToggle value={rememberMe} disabled={loading} onChange={setRememberMe} />

				<PrimaryActionButton label={copy.primaryButton} loading={loading} disabled={isPrimaryDisabled} onPress={handlePrimaryPress} mode={mode} />

				<TouchableOpacity style={styles.linkButton} onPress={handleOpenReset} disabled={loading}>
					<Text style={styles.linkButtonText}>비밀번호를 잊으셨나요?</Text>
				</TouchableOpacity>

				<SocialLoginButtons disabled={loading} />

				<GuestButton loading={loading} onPress={handleGuestPress} />

				<AuthModeSwitch prompt={copy.togglePrompt} actionLabel={copy.toggleAction} disabled={loading} onToggle={handleToggleMode} />

				<Text style={styles.footerNote}>게스트 모드에서는 단어 저장이 최대 10개로 제한돼요.</Text>
			</View>
			<ForgotPasswordModal
				visible={resetVisible}
				email={resetEmail}
				errorMessage={resetError}
				loading={resetLoading}
				onChangeEmail={setResetEmail}
				onClose={handleCloseReset}
				onSubmit={handleSubmitReset}
			/>
		</SafeAreaView>
	);
}
