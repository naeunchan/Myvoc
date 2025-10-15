import React from "react";
import { ActivityIndicator, Text, TouchableOpacity, View } from "react-native";
import { styles } from "@/screens/Auth/LoginScreen.styles";

type PrimaryActionButtonProps = {
	label: string;
	loading: boolean;
	disabled: boolean;
	onPress: () => void;
	mode: "login" | "signup";
};

export function PrimaryActionButton({ label, loading, disabled, onPress, mode }: PrimaryActionButtonProps) {
	return (
		<TouchableOpacity
			style={[styles.button, disabled && styles.disabledButton]}
			onPress={onPress}
			disabled={disabled}
			activeOpacity={0.9}
		>
			{loading ? (
				<View style={styles.buttonLoadingRow}>
					<ActivityIndicator size="small" color="#ffffff" />
					<Text style={styles.buttonLoadingText}>{mode === "login" ? "로그인 중..." : "가입 중..."}</Text>
				</View>
			) : (
				<Text style={styles.buttonText}>{label}</Text>
			)}
		</TouchableOpacity>
	);
}
