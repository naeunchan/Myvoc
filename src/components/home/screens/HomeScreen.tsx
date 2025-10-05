import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Text, View } from "react-native";
import { DictionaryMode } from "@/components/dictionary/types";
import { HomeScreenProps } from "@/components/home/types/HomeScreen";
import { styles } from "@/components/home/styles/HomeScreen.styles";

const MODE_LABEL: Record<DictionaryMode, string> = {
	"en-en": "영영사전",
	"en-ko": "영한사전",
};

export function HomeScreen({ favoritesCount, lastSearchedWord, mode }: HomeScreenProps) {
	return (
		<SafeAreaView style={styles.safeArea}>
			<View style={styles.content}>
				<Text style={styles.title}>나만의 영어 단어장</Text>
				<Text style={styles.subtitle}>하단의 탭을 눌러 기능을 이용해보세요.</Text>

				<View style={styles.card}>
					<Text style={styles.cardTitle}>현재 요약</Text>
					<Text style={styles.cardText}>사전 모드: {MODE_LABEL[mode]}</Text>
					<Text style={styles.cardText}>내 단어장: {favoritesCount}개 저장됨</Text>
					{lastSearchedWord ? (
						<Text style={styles.cardText}>최근 검색: {lastSearchedWord}</Text>
					) : null}
				</View>
			</View>
		</SafeAreaView>
	);
}
