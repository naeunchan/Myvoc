import React from "react";
import { ActivityIndicator, Text, View } from "react-native";
import { LoadingStateProps } from "@/app/components/LoadingState/LoadingState.types";
import { loadingStateStyles as styles } from "@/app/components/LoadingState/LoadingState.styles";

export function LoadingState({ message }: LoadingStateProps) {
	return (
		<View style={styles.container}>
			<ActivityIndicator size="large" color="#2f80ed" />
			<Text style={styles.message}>{message}</Text>
		</View>
	);
}
