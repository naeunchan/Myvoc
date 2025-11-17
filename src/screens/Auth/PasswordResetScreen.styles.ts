import { StyleSheet } from "react-native";
import type { AppThemeColors } from "@/theme/types";
import { scaleFont } from "@/theme/utils";

export const createPasswordResetScreenStyles = (theme: AppThemeColors, fontScale: number) =>
	StyleSheet.create({
		safeArea: {
			flex: 1,
			backgroundColor: theme.background,
		},
		content: {
			flex: 1,
			paddingHorizontal: 24,
			paddingTop: 32,
			paddingBottom: 24,
			gap: 16,
		},
		header: {
			gap: 12,
		},
		title: {
			fontSize: scaleFont(24, fontScale),
			fontWeight: "700",
			color: theme.textPrimary,
		},
		description: {
			fontSize: scaleFont(15, fontScale),
			color: theme.textSecondary,
			lineHeight: scaleFont(22, fontScale),
		},
		textInput: {
			borderWidth: 1,
			borderColor: theme.inputBorder,
			borderRadius: 14,
			paddingHorizontal: 16,
			paddingVertical: 14,
			fontSize: scaleFont(15, fontScale),
			color: theme.textPrimary,
			backgroundColor: theme.inputBackground,
		},
		errorText: {
			color: theme.danger,
			fontSize: scaleFont(13, fontScale),
		},
		successCard: {
			borderRadius: 14,
			padding: 16,
			backgroundColor: "rgba(16,185,129,0.12)",
			borderWidth: 1,
			borderColor: theme.success,
		},
		successText: {
			color: theme.success,
			fontSize: scaleFont(14, fontScale),
			lineHeight: scaleFont(20, fontScale),
			fontWeight: "600",
		},
		helperText: {
			fontSize: scaleFont(12, fontScale),
			color: theme.textMuted,
			lineHeight: scaleFont(18, fontScale),
		},
		noticeCard: {
			borderRadius: 14,
			borderWidth: 1,
			borderColor: theme.border,
			padding: 16,
			backgroundColor: theme.surface,
			gap: 6,
		},
		noticeTitle: {
			fontSize: scaleFont(13, fontScale),
			fontWeight: "700",
			color: theme.textPrimary,
		},
		noticeText: {
			fontSize: scaleFont(13, fontScale),
			color: theme.textSecondary,
			lineHeight: scaleFont(18, fontScale),
		},
		actions: {
			marginTop: "auto",
			gap: 12,
		},
		primaryButton: {
			borderRadius: 14,
			paddingVertical: 14,
			alignItems: "center",
			backgroundColor: theme.accent,
		},
		primaryButtonText: {
			color: theme.accentContrast,
			fontSize: scaleFont(16, fontScale),
			fontWeight: "700",
		},
		secondaryButton: {
			borderRadius: 14,
			paddingVertical: 12,
			alignItems: "center",
			borderWidth: 1,
			borderColor: theme.border,
		},
		secondaryButtonText: {
			color: theme.textPrimary,
			fontSize: scaleFont(15, fontScale),
			fontWeight: "600",
		},
		buttonDisabled: {
			opacity: 0.6,
		},
	});
