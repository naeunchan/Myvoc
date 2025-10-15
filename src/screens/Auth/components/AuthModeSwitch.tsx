import React from "react";
import { Text, TouchableOpacity } from "react-native";
import { styles } from "@/screens/Auth/LoginScreen.styles";

type AuthModeSwitchProps = {
	prompt: string;
	actionLabel: string;
	disabled: boolean;
	onToggle: () => void;
};

export function AuthModeSwitch({ prompt, actionLabel, disabled, onToggle }: AuthModeSwitchProps) {
	return (
		<TouchableOpacity
			style={styles.modeSwitch}
			onPress={onToggle}
			disabled={disabled}
			activeOpacity={0.9}
		>
			<Text style={styles.modeSwitchText}>{prompt}</Text>
			<Text style={styles.modeSwitchAction}>{actionLabel}</Text>
		</TouchableOpacity>
	);
}
