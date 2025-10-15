import React from "react";
import { Text, TouchableOpacity } from "react-native";
import { styles } from "@/screens/Auth/LoginScreen.styles";

type GuestButtonProps = {
	loading: boolean;
	onPress: () => void;
};

export function GuestButton({ loading, onPress }: GuestButtonProps) {
	return (
		<TouchableOpacity
			style={[styles.ghostButton, loading && styles.disabledButton]}
			onPress={onPress}
			disabled={loading}
			activeOpacity={0.9}
		>
			<Text style={styles.ghostButtonText}>게스트로 둘러보기</Text>
		</TouchableOpacity>
	);
}
