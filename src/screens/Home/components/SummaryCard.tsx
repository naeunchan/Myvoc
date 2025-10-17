import React from "react";
import { Text, View } from "react-native";
import { MODE_LABEL } from "@/screens/Home/constants";
import { styles } from "@/screens/Home/HomeScreen.styles";
import { DictionaryMode } from "@/features/dictionary/types";
import { MEMORIZATION_STATUSES, MemorizationStatus } from "@/features/favorites/types";

type SummaryCardProps = {
	userName: string;
	mode: DictionaryMode;
	counts: Record<MemorizationStatus, number>;
	lastSearchedWord: string | null;
};

export function SummaryCard({ userName, mode, counts, lastSearchedWord }: SummaryCardProps) {
	const total = (counts?.toMemorize ?? 0) + (counts?.review ?? 0) + (counts?.mastered ?? 0);
	return (
		<View style={styles.card}>
			<Text style={styles.cardTitle}>현재 요약</Text>
			<Text style={styles.cardText}>사용자: {userName}</Text>
			<Text style={styles.cardText}>사전 모드: {MODE_LABEL[mode]}</Text>
			<Text style={styles.cardText}>전체 단어: {total}개 저장됨</Text>
			<Text style={styles.cardText}>외울 단어장: {counts?.toMemorize ?? 0}개</Text>
			<Text style={styles.cardText}>복습 단어장: {counts?.review ?? 0}개</Text>
			<Text style={styles.cardText}>터득한 단어장: {counts?.mastered ?? 0}개</Text>
			{lastSearchedWord ? <Text style={styles.cardText}>최근 검색: {lastSearchedWord}</Text> : null}
		</View>
	);
}
