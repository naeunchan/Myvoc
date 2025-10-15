import React from "react";
import { Text, View } from "react-native";
import { MODE_LABEL } from "@/screens/Home/constants";
import { styles } from "@/screens/Home/HomeScreen.styles";
import { DictionaryMode } from "@/features/dictionary/types";

type SummaryCardProps = {
	userName: string;
	mode: DictionaryMode;
	favoritesCount: number;
	lastSearchedWord: string | null;
};

export function SummaryCard({ userName, mode, favoritesCount, lastSearchedWord }: SummaryCardProps) {
	return (
		<View style={styles.card}>
			<Text style={styles.cardTitle}>현재 요약</Text>
			<Text style={styles.cardText}>사용자: {userName}</Text>
			<Text style={styles.cardText}>사전 모드: {MODE_LABEL[mode]}</Text>
			<Text style={styles.cardText}>내 단어장: {favoritesCount}개 저장됨</Text>
			{lastSearchedWord ? <Text style={styles.cardText}>최근 검색: {lastSearchedWord}</Text> : null}
		</View>
	);
}
