import React from "react";
import { Text, TextInput, View } from "react-native";
import { createLoginScreenStyles } from "@/screens/Auth/LoginScreen.styles";
import { useThemedStyles } from "@/theme/useThemedStyles";
import { useAppAppearance } from "@/theme/AppearanceContext";

type CredentialFieldsProps = {
	mode: "login" | "signup";
	username: string;
	password: string;
	displayName: string;
	loading: boolean;
	onChangeUsername: (value: string) => void;
	onChangePassword: (value: string) => void;
	onChangeDisplayName: (value: string) => void;
};

export function CredentialFields({
	mode,
	username,
	password,
	displayName,
	loading,
	onChangeUsername,
	onChangePassword,
	onChangeDisplayName,
}: CredentialFieldsProps) {
	const styles = useThemedStyles(createLoginScreenStyles);
	const { theme } = useAppAppearance();
	const isSignUp = mode === "signup";

	return (
		<View>
			<Text style={styles.inputLabel}>아이디</Text>
			<TextInput
				style={styles.textInput}
				value={username}
				onChangeText={onChangeUsername}
				placeholder="아이디를 입력하세요"
				autoCapitalize="none"
				autoCorrect={false}
				editable={!loading}
				autoComplete="username"
				textContentType="username"
				returnKeyType="next"
				placeholderTextColor={theme.textMuted}
			/>
			{isSignUp ? <Text style={styles.ruleText}>아이디는 6~30자의 영문 소문자, 숫자, 마침표만 사용할 수 있어요.</Text> : null}

			<Text style={styles.inputLabel}>비밀번호</Text>
			<TextInput
				style={styles.textInput}
				value={password}
				onChangeText={onChangePassword}
				placeholder="비밀번호를 입력하세요"
				secureTextEntry
				editable={!loading}
				autoComplete={isSignUp ? "new-password" : "password"}
				textContentType={isSignUp ? "newPassword" : "password"}
				returnKeyType={isSignUp ? "next" : "done"}
				placeholderTextColor={theme.textMuted}
			/>
			{isSignUp ? <Text style={styles.ruleText}>비밀번호는 8자 이상이며 영문과 숫자를 모두 포함해야 해요.</Text> : null}

			{isSignUp ? (
				<View>
					<Text style={styles.inputLabel}>표시 이름 (선택)</Text>
					<TextInput
						style={styles.textInput}
						value={displayName}
						onChangeText={onChangeDisplayName}
						placeholder="앱에서 사용할 닉네임을 입력하세요"
						autoCapitalize="none"
						autoCorrect={false}
						editable={!loading}
						returnKeyType="done"
						placeholderTextColor={theme.textMuted}
					/>
					<Text style={styles.ruleText}>닉네임을 입력하지 않으면 랜덤 이름이 표시돼요.</Text>
				</View>
			) : null}
		</View>
	);
}
