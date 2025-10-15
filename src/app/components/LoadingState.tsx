import React from "react";
import { ActivityIndicator, Text, View } from "react-native";
import { appStyles } from "@/app/styles/AppRoot.styles";

type LoadingStateProps = {
	message: string;
};

export function LoadingState({ message }: LoadingStateProps) {
	return (
		<View style={appStyles.initializingState}>
			<ActivityIndicator size="large" color="#2f80ed" />
			<Text style={appStyles.initializingText}>{message}</Text>
		</View>
	);
}
