import { StyleSheet } from "react-native";
import type { AppThemeColors } from "@/theme/types";
import { scaleFont } from "@/theme/utils";

export const createDictionaryModeToggleStyles = (theme: AppThemeColors, fontScale: number) =>
	StyleSheet.create({
		container: {
			flexDirection: "row",
			alignItems: "center",
			backgroundColor: theme.cardMuted,
			borderRadius: 12,
			padding: 4,
			marginBottom: 16,
		},
		button: {
			flex: 1,
			paddingVertical: 10,
			borderRadius: 10,
			alignItems: "center",
		},
		disabledButton: {
			opacity: 0.5,
		},
		activeButton: {
			backgroundColor: theme.surface,
			shadowColor: theme.shadow,
			shadowOffset: { width: 0, height: 1 },
			shadowOpacity: 0.05,
			shadowRadius: 2,
			elevation: 1,
		},
		label: {
			fontSize: scaleFont(14, fontScale),
			fontWeight: "600",
			color: theme.textSecondary,
		},
		activeLabel: {
			color: theme.textPrimary,
		},
		disabledLabel: {
			color: theme.textMuted,
		},
	});
