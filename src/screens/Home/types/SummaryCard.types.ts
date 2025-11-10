import { DictionaryMode } from "@/features/dictionary/types";
import { MemorizationStatus } from "@/features/favorites/types";

export type SummaryCardProps = {
	userName: string;
	mode: DictionaryMode;
	counts: Record<MemorizationStatus, number>;
	lastSearchedWord: string | null;
};
