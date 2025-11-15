import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { createLoginScreenStyles } from "@/screens/Auth/LoginScreen.styles";
import { useThemedStyles } from "@/theme/useThemedStyles";

type SocialLoginButtonsProps = {
	disabled?: boolean;
	onSocialLogin?: () => void;
};

export function SocialLoginButtons({ disabled, onSocialLogin }: SocialLoginButtonsProps) {
	const styles = useThemedStyles(createLoginScreenStyles);

	return (
		<View style={styles.socialContainer}>
			<View style={styles.socialDivider}>
				<View style={styles.socialDividerLine} />
				<Text style={styles.socialDividerText}>또는</Text>
				<View style={styles.socialDividerLine} />
			</View>
			<TouchableOpacity
				style={[styles.socialButton, disabled && styles.socialButtonDisabled]}
				onPress={onSocialLogin}
				disabled={disabled}
				activeOpacity={0.85}
			>
				<Text style={styles.socialButtonText}>소셜 로그인 (준비중)</Text>
			</TouchableOpacity>
		</View>
	);
}
