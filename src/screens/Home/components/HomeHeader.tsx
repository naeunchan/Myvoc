import React from "react";
import { Text, View } from "react-native";
import { styles } from "@/screens/Home/HomeScreen.styles";

export function HomeHeader() {
	return (
		<View style={styles.header}>
			<Text style={styles.title}>나만의 영어 단어장</Text>
			<Text style={styles.subtitle}>하단의 탭을 눌러 기능을 이용해보세요.</Text>
		</View>
	);
}
