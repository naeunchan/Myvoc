import React, { useCallback } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Text, TouchableOpacity, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import type { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import { DictionaryModeToggle } from "@/features/dictionary/components/DictionaryModeToggle";
import { SettingsScreenProps } from "@/screens/Settings/SettingsScreen.types";
import { styles } from "@/screens/Settings/SettingsScreen.styles";
import type { RootTabParamList } from "@/navigation/Navigation.types";

export function SettingsScreen({ mode, onModeChange }: SettingsScreenProps) {
	const navigation = useNavigation<BottomTabNavigationProp<RootTabParamList>>();

	const handleGoHome = useCallback(() => {
		navigation.navigate("Home");
	}, [navigation]);

	return (
		<SafeAreaView style={styles.safeArea}>
			<View style={styles.content}>
				<Text style={styles.title}>설정</Text>
				<Text style={styles.description}>사전 모드를 선택해보세요.</Text>
				<DictionaryModeToggle mode={mode} onChange={onModeChange} />
				<TouchableOpacity style={styles.homeButton} onPress={handleGoHome} activeOpacity={0.9}>
					<Text style={styles.homeButtonText}>초기 화면으로 이동</Text>
				</TouchableOpacity>
			</View>
		</SafeAreaView>
	);
}
