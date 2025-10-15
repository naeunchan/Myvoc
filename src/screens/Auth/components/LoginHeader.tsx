import React from "react";
import { Text, View } from "react-native";
import { styles } from "@/screens/Auth/LoginScreen.styles";

type LoginHeaderProps = {
	title: string;
	subtitle: string;
};

export function LoginHeader({ title, subtitle }: LoginHeaderProps) {
	return (
		<View>
			<Text style={styles.title}>{title}</Text>
			<Text style={styles.subtitle}>{subtitle}</Text>
		</View>
	);
}
