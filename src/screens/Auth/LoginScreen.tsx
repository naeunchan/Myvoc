import React, { useCallback, useEffect, useState } from "react";
import { ActivityIndicator, Switch, Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { styles } from "@/screens/Auth/LoginScreen.styles";
import { LoginScreenProps } from "@/screens/Auth/LoginScreen.types";

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

	const trimmedUsername = username.trim();
	const trimmedPassword = password.trim();
	const trimmedDisplayName = displayName.trim();
	const isPrimaryDisabled =
		loading || trimmedUsername.length === 0 || trimmedPassword.length === 0;

	const handlePrimaryPress = useCallback(() => {
		if (isPrimaryDisabled) {
			return;
		}

		if (mode === "login") {
			onLogin(trimmedUsername, trimmedPassword, { rememberMe });
			return;
		}

		onSignUp(trimmedUsername, trimmedPassword, trimmedDisplayName, { rememberMe });
	}, [
		isPrimaryDisabled,
		mode,
		onLogin,
		onSignUp,
		rememberMe,
		trimmedDisplayName,
		trimmedPassword,
		trimmedUsername,
	]);

	const handleGuestPress = useCallback(() => {
		if (loading) {
			return;
		}
		onGuest();
	}, [loading, onGuest]);

	const handleToggleMode = useCallback(() => {
		if (loading) {
			return;
		}
		setMode((prev) => (prev === "login" ? "signup" : "login"));
		setPassword("");
		setDisplayName("");
	}, [loading]);

	const titleText = mode === "login" ? "다시 만나서 반가워요!" : "처음 오셨군요!";
	const subtitleText =
		mode === "login"
			? "계정으로 로그인하거나, 게스트로 간단히 체험해보세요."
			: "간단히 회원가입하고 모든 기능을 이용해보세요.";
	const primaryButtonText = mode === "login" ? "로그인" : "회원가입";
	const helperText =
		mode === "login"
			? "로그인하면 단어 저장, 즐겨찾기 동기화 등 모든 기능을 사용할 수 있어요."
			: "회원가입을 완료하면 자동으로 로그인되어 바로 사용할 수 있어요.";
	const togglePrompt = mode === "login" ? "아직 계정이 없으신가요?" : "이미 계정이 있으신가요?";
	const toggleActionText = mode === "login" ? "회원가입" : "로그인";

	return (
		<SafeAreaView style={styles.safeArea}>
			<View style={styles.content}>
				<Text style={styles.title}>{titleText}</Text>
				<Text style={styles.subtitle}>{subtitleText}</Text>

				{errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}

				<Text style={styles.inputLabel}>아이디</Text>
				<TextInput
					style={styles.textInput}
					value={username}
					onChangeText={setUsername}
					placeholder="아이디를 입력하세요"
					autoCapitalize="none"
					autoCorrect={false}
					editable={!loading}
					autoComplete="username"
					textContentType="username"
					returnKeyType="next"
				/>
				{mode === "signup" ? (
					<Text style={styles.ruleText}>아이디는 6~30자의 영문 소문자, 숫자, 마침표만 사용할 수 있어요.</Text>
				) : null}

				<Text style={styles.inputLabel}>비밀번호</Text>
				<TextInput
					style={styles.textInput}
					value={password}
					onChangeText={setPassword}
					placeholder="비밀번호를 입력하세요"
					secureTextEntry
					editable={!loading}
					autoComplete={mode === "signup" ? "new-password" : "password"}
					textContentType={mode === "signup" ? "newPassword" : "password"}
					returnKeyType={mode === "signup" ? "next" : "done"}
				/>
				{mode === "signup" ? (
					<Text style={styles.ruleText}>비밀번호는 8자 이상이며 영문과 숫자를 모두 포함해야 해요.</Text>
				) : null}

				{mode === "signup" ? (
					<>
						<Text style={styles.inputLabel}>표시 이름 (선택)</Text>
						<TextInput
							style={styles.textInput}
							value={displayName}
							onChangeText={setDisplayName}
							placeholder="앱에서 사용할 닉네임을 입력하세요"
							autoCapitalize="none"
							autoCorrect={false}
							editable={!loading}
							returnKeyType="done"
						/>
						<Text style={styles.ruleText}>닉네임을 입력하지 않으면 랜덤 이름이 표시돼요.</Text>
					</>
				) : null}

				<Text style={styles.helperText}>{helperText}</Text>

				<View style={styles.rememberRow}>
					<Text style={styles.rememberLabel}>자동 로그인</Text>
					<Switch
						value={rememberMe}
						onValueChange={setRememberMe}
						disabled={loading}
						trackColor={{ false: "#d1d5db", true: "#93c5fd" }}
						thumbColor={rememberMe ? "#2563eb" : "#f9fafb"}
						ios_backgroundColor="#d1d5db"
					/>
				</View>

				<TouchableOpacity
					style={[styles.button, isPrimaryDisabled && styles.disabledButton]}
					onPress={handlePrimaryPress}
					disabled={isPrimaryDisabled}
					activeOpacity={0.9}
				>
					{loading ? (
						<View style={styles.buttonLoadingRow}>
							<ActivityIndicator size="small" color="#ffffff" />
							<Text style={styles.buttonLoadingText}>{mode === "login" ? "로그인 중..." : "가입 중..."}</Text>
						</View>
					) : (
						<Text style={styles.buttonText}>{primaryButtonText}</Text>
					)}
				</TouchableOpacity>

				<TouchableOpacity
					style={[styles.ghostButton, loading && styles.disabledButton]}
					onPress={handleGuestPress}
					disabled={loading}
					activeOpacity={0.9}
				>
					<Text style={styles.ghostButtonText}>게스트로 둘러보기</Text>
				</TouchableOpacity>

				<TouchableOpacity
					style={styles.modeSwitch}
					onPress={handleToggleMode}
					disabled={loading}
					activeOpacity={0.9}
				>
					<Text style={styles.modeSwitchText}>{togglePrompt}</Text>
					<Text style={styles.modeSwitchAction}>{toggleActionText}</Text>
				</TouchableOpacity>

				<Text style={styles.footerNote}>게스트 모드에서는 단어 저장이 최대 10개로 제한돼요.</Text>
			</View>
		</SafeAreaView>
	);
}
