import React from "react";
import { Text, View } from "react-native";
import { MODE_LABEL } from "@/screens/Home/constants";
import { styles } from "@/screens/Home/HomeScreen.styles";
import { DictionaryMode } from "@/features/dictionary/types";
import { MemorizationStatus } from "@/features/favorites/types";

type SummaryCardProps = {
	userName: string;
	mode: DictionaryMode;
	counts: Record<MemorizationStatus, number>;
	lastSearchedWord: string | null;
};

export function SummaryCard({ userName, mode, counts, lastSearchedWord }: SummaryCardProps) {
	const total = (counts?.toMemorize ?? 0) + (counts?.review ?? 0) + (counts?.mastered ?? 0);
	const stats = [
		{ label: "전체 단어", value: total },
		{ label: "외울 단어", value: counts?.toMemorize ?? 0 },
		{ label: "복습 단어", value: counts?.review ?? 0 },
		{ label: "터득한 단어", value: counts?.mastered ?? 0 },
	];

	return (
		<View style={styles.summaryCard}>
			<View style={styles.summaryHeader}>
				<View>
					<Text style={styles.sectionLabel}>현재 요약</Text>
					<Text style={styles.summaryGreeting}>{userName?.trim() ? `${userName}님의 진행상황` : "내 학습 현황"}</Text>
				</View>
				<View style={styles.modeBadge}>
					<Text style={styles.modeBadgeText}>{MODE_LABEL[mode]}</Text>
				</View>
			</View>

			<View style={styles.summaryGrid}>
				{stats.map((stat) => (
					<View key={stat.label} style={styles.summaryStat}>
						<Text style={styles.summaryStatLabel}>{stat.label}</Text>
						<Text style={styles.summaryStatValue}>{stat.value}</Text>
					</View>
				))}
			</View>

			<View style={styles.summaryFooter}>
				<Text style={styles.summaryFooterLabel}>최근 검색</Text>
				<Text style={styles.summaryFooterValue}>{lastSearchedWord ?? "아직 검색 기록이 없어요."}</Text>
			</View>
		</View>
	);
}
