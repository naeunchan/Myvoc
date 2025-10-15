import React from "react";
import { Switch, Text, View } from "react-native";
import { styles } from "@/screens/Auth/LoginScreen.styles";

type RememberMeToggleProps = {
	value: boolean;
	disabled?: boolean;
	onChange: (value: boolean) => void;
};

export function RememberMeToggle({ value, disabled = false, onChange }: RememberMeToggleProps) {
	return (
		<View style={styles.rememberRow}>
			<Text style={styles.rememberLabel}>자동 로그인</Text>
			<Switch
				value={value}
				onValueChange={onChange}
				disabled={disabled}
				trackColor={{ false: "#d1d5db", true: "#93c5fd" }}
				thumbColor={value ? "#2563eb" : "#f9fafb"}
				ios_backgroundColor="#d1d5db"
			/>
		</View>
	);
}
