import React from "react";
import { Text, View } from "react-native";
import { styles } from "@/screens/Home/HomeScreen.styles";

type HomeHeaderProps = {
	userName: string;
};

export function HomeHeader({ userName }: HomeHeaderProps) {
	const displayName = userName?.trim() ? `${userName}님` : "나만의 영어 단어장";
	return (
		<View style={styles.heroCard}>
			<Text style={styles.heroBadge}>나의 학습 공간</Text>
			<Text style={styles.heroTitle}>
				{displayName}
				{"\n"}오늘도 단어를 만나봐요
			</Text>
			<Text style={styles.heroSubtitle}>최근에 저장한 단어와 요약 정보가 아래 카드에 정리돼요.</Text>
		</View>
	);
}
