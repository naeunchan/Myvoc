import { DictionaryMode } from "@/services/dictionary/types";

export const MODE_LABEL: Record<DictionaryMode, string> = {
	"en-en": "영영사전",
	"en-ko": "영한사전",
};

export const HOME_HEADER_TEXT = {
	badgeLabel: "나의 학습 공간",
	defaultDisplayName: "나만의 영어 단어장",
	titleSuffix: "오늘도 단어를 만나봐요",
	subtitle: "최근에 저장한 단어와 요약 정보가 아래 카드에 정리돼요.",
};

export const SUMMARY_CARD_TEXT = {
	sectionLabel: "현재 요약",
	defaultGreeting: "내 학습 현황",
	lastSearchLabel: "최근 검색",
	lastSearchFallback: "아직 검색 기록이 없어요.",
};

export const SUMMARY_STAT_CONFIG = [
	{ key: "total", label: "전체 단어" },
	{ key: "toMemorize", label: "외울 단어" },
	{ key: "review", label: "복습 단어" },
	{ key: "mastered", label: "터득한 단어" },
] as const;

export type SummaryStatKey = (typeof SUMMARY_STAT_CONFIG)[number]["key"];

export const FAVORITES_LIST_TEXT = {
	sectionLabel: "외울 단어장",
	subtitle: "오늘 복습할 단어를 여기서 관리하세요.",
	defaultEmpty: "저장된 단어가 없어요.",
};
