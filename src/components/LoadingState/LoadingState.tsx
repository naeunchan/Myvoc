import React from "react";
import { ActivityIndicator, Text, View } from "react-native";
import { LoadingStateProps } from "@/components/LoadingState/LoadingState.types";
import { createLoadingStateStyles } from "@/components/LoadingState/LoadingState.styles";
import { useThemedStyles } from "@/theme/useThemedStyles";
import { useAppAppearance } from "@/theme/AppearanceContext";

export function LoadingState({ message }: LoadingStateProps) {
	const styles = useThemedStyles(createLoadingStateStyles);
	const { theme } = useAppAppearance();
	return (
		<View style={styles.container}>
			<ActivityIndicator size="large" color={theme.accent} />
			<Text style={styles.message}>{message}</Text>
		</View>
	);
}
