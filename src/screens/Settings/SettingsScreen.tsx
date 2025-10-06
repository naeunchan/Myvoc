import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Text, View } from "react-native";
import { DictionaryModeToggle } from "@/features/dictionary/components/DictionaryModeToggle";
import { SettingsScreenProps } from "@/screens/Settings/SettingsScreen.types";
import { styles } from "@/screens/Settings/SettingsScreen.styles";

export function SettingsScreen({ mode, onModeChange }: SettingsScreenProps) {
	return (
		<SafeAreaView style={styles.safeArea}>
			<View style={styles.content}>
				<Text style={styles.title}>설정</Text>
				<Text style={styles.description}>사전 모드를 선택해보세요.</Text>
				<DictionaryModeToggle mode={mode} onChange={onModeChange} />
			</View>
		</SafeAreaView>
	);
}
