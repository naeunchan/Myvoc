import { StyleSheet } from "react-native";
import type { AppThemeColors } from "@/theme/types";
import { scaleFont } from "@/theme/utils";

export const createLegalInfoScreenStyles = (theme: AppThemeColors, fontScale: number) =>
	StyleSheet.create({
		safeArea: {
			flex: 1,
			backgroundColor: theme.background,
		},
		scrollContent: {
			padding: 24,
			gap: 24,
		},
		headerCard: {
			backgroundColor: theme.surface,
			borderRadius: 24,
			padding: 24,
			gap: 12,
			borderWidth: 1,
			borderColor: theme.border,
		},
		appName: {
			fontSize: scaleFont(22, fontScale),
			fontWeight: "700",
			color: theme.textPrimary,
		},
		appVersion: {
			fontSize: scaleFont(14, fontScale),
			color: theme.textSecondary,
		},
		description: {
			fontSize: scaleFont(14, fontScale),
			lineHeight: scaleFont(20, fontScale),
			color: theme.textSecondary,
		},
		linkCard: {
			backgroundColor: theme.surface,
			borderRadius: 20,
			padding: 20,
			borderWidth: 1,
			borderColor: theme.border,
			gap: 10,
		},
		linkTitle: {
			fontSize: scaleFont(16, fontScale),
			fontWeight: "700",
			color: theme.textPrimary,
		},
		linkSubtitle: {
			fontSize: scaleFont(13, fontScale),
			color: theme.textSecondary,
		},
		linkButton: {
			alignSelf: "flex-start",
			borderRadius: 999,
			paddingHorizontal: 16,
			paddingVertical: 8,
			backgroundColor: theme.accent,
		},
		linkButtonLabel: {
			color: theme.accentContrast,
			fontWeight: "700",
			fontSize: scaleFont(13, fontScale),
		},
	});
