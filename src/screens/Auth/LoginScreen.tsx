import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { styles } from "@/screens/Auth/LoginScreen.styles";
import { LoginScreenProps } from "@/screens/Auth/LoginScreen.types";
import { LoginHeader } from "@/screens/Auth/components/LoginHeader";
import { CredentialFields } from "@/screens/Auth/components/CredentialFields";
import { RememberMeToggle } from "@/screens/Auth/components/RememberMeToggle";
import { PrimaryActionButton } from "@/screens/Auth/components/PrimaryActionButton";
import { GuestButton } from "@/screens/Auth/components/GuestButton";
import { AuthModeSwitch } from "@/screens/Auth/components/AuthModeSwitch";
import { getLoginCopy } from "@/screens/Auth/constants/loginCopy";

export function LoginScreen({
	onLogin,
	onSignUp,
	onGuest,
	loading = false,
	errorMessage,
	initialMode = "login",
}: LoginScreenProps) {
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [displayName, setDisplayName] = useState("");
	const [mode, setMode] = useState<"login" | "signup">(initialMode);
	const [rememberMe, setRememberMe] = useState(false);

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

				<Text style={styles.helperText}>{copy.helperText}</Text>

				<RememberMeToggle value={rememberMe} disabled={loading} onChange={setRememberMe} />

				<PrimaryActionButton
					label={copy.primaryButton}
					loading={loading}
					disabled={isPrimaryDisabled}
					onPress={handlePrimaryPress}
					mode={mode}
				/>

				<GuestButton loading={loading} onPress={handleGuestPress} />

				<AuthModeSwitch
					prompt={copy.togglePrompt}
					actionLabel={copy.toggleAction}
					disabled={loading}
					onToggle={handleToggleMode}
				/>

				<Text style={styles.footerNote}>게스트 모드에서는 단어 저장이 최대 10개로 제한돼요.</Text>
			</View>
		</SafeAreaView>
	);
}
