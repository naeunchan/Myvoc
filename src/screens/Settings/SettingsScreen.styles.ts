import { StyleSheet } from "react-native";
import type { AppThemeColors } from "@/theme/types";
import { scaleFont } from "@/theme/utils";

export const createStyles = (theme: AppThemeColors, fontScale: number) =>
	StyleSheet.create({
		safeArea: {
			flex: 1,
			backgroundColor: theme.background,
		},
		scrollContent: {
			paddingHorizontal: 16,
			paddingVertical: 24,
			gap: 24,
		},
		profileCard: {
			backgroundColor: theme.surface,
			borderRadius: 20,
			padding: 20,
			flexDirection: "row",
			alignItems: "center",
			gap: 16,
			shadowColor: theme.shadow,
			shadowOffset: { width: 0, height: 8 },
			shadowOpacity: 0.08,
			shadowRadius: 16,
			elevation: 4,
		},
		profileAvatar: {
			width: 56,
			height: 56,
			borderRadius: 28,
			backgroundColor: theme.accent,
			alignItems: "center",
			justifyContent: "center",
		},
		profileAvatarInitial: {
			color: theme.accentContrast,
			fontSize: scaleFont(20, fontScale),
			fontWeight: "700",
		},
		profileInfo: {
			flex: 1,
		},
		profileName: {
			fontSize: scaleFont(18, fontScale),
			fontWeight: "700",
			color: theme.textPrimary,
		},
		profileSubtitle: {
			fontSize: scaleFont(14, fontScale),
			color: theme.textSecondary,
			marginTop: 2,
		},
		profileAction: {
			paddingHorizontal: 14,
			paddingVertical: 8,
			borderRadius: 16,
			backgroundColor: theme.chipBackground,
		},
		profileActionText: {
			fontSize: scaleFont(13, fontScale),
			fontWeight: "600",
			color: theme.chipText,
		},
		section: {
			gap: 8,
		},
		sectionLabel: {
			fontSize: scaleFont(13, fontScale),
			color: theme.textMuted,
			textTransform: "uppercase",
			letterSpacing: 0.5,
			marginLeft: 4,
		},
		sectionCard: {
			backgroundColor: theme.surface,
			borderRadius: 18,
			shadowColor: theme.shadow,
			shadowOffset: { width: 0, height: 6 },
			shadowOpacity: 0.06,
			shadowRadius: 12,
			elevation: 3,
			overflow: "hidden",
		},
		row: {
			flexDirection: "row",
			alignItems: "center",
			paddingHorizontal: 16,
			paddingVertical: 14,
			backgroundColor: theme.surface,
		},
		rowBorder: {
			borderBottomWidth: 1,
			borderBottomColor: theme.border,
		},
		rowLabel: {
			flex: 1,
			fontSize: scaleFont(16, fontScale),
			color: theme.textPrimary,
		},
		rowValue: {
			fontSize: scaleFont(16, fontScale),
			color: theme.textSecondary,
		},
		rowChevron: {
			fontSize: scaleFont(20, fontScale),
			color: theme.textMuted,
		},
		rowDisabled: {
			opacity: 0.6,
		},
		rowDangerText: {
			color: theme.danger,
		},
		guestCard: {
			backgroundColor: theme.surface,
			borderRadius: 18,
			padding: 20,
			gap: 12,
			shadowColor: theme.shadow,
			shadowOffset: { width: 0, height: 6 },
			shadowOpacity: 0.06,
			shadowRadius: 12,
			elevation: 3,
		},
		guestTitle: {
			fontSize: scaleFont(17, fontScale),
			fontWeight: "700",
			color: theme.textPrimary,
		},
		guestDescription: {
			fontSize: scaleFont(14, fontScale),
			color: theme.textSecondary,
			lineHeight: scaleFont(20, fontScale),
		},
		primaryCta: {
			backgroundColor: theme.accent,
			borderRadius: 14,
			paddingVertical: 14,
			alignItems: "center",
		},
		primaryCtaText: {
			color: theme.accentContrast,
			fontSize: scaleFont(16, fontScale),
			fontWeight: "600",
		},
		secondaryCta: {
			borderWidth: 1,
			borderColor: theme.border,
			borderRadius: 14,
			paddingVertical: 14,
			alignItems: "center",
		},
		secondaryCtaText: {
			color: theme.textPrimary,
			fontSize: scaleFont(16, fontScale),
			fontWeight: "600",
		},
		preferenceGroup: {
			paddingHorizontal: 16,
			paddingVertical: 18,
			gap: 12,
			borderBottomWidth: 1,
			borderBottomColor: theme.border,
		},
		preferenceGroupLast: {
			borderBottomWidth: 0,
		},
		preferenceTitle: {
			fontSize: scaleFont(15, fontScale),
			fontWeight: "700",
			color: theme.textPrimary,
		},
		preferenceOptions: {
			flexDirection: "row",
			gap: 10,
		},
		preferenceButton: {
			flex: 1,
			borderRadius: 14,
			paddingVertical: 10,
			alignItems: "center",
			borderWidth: 1,
			borderColor: theme.border,
			backgroundColor: theme.surfaceMuted,
		},
		preferenceButtonActive: {
			backgroundColor: theme.accent,
			borderColor: theme.accent,
			shadowColor: theme.shadow,
			shadowOffset: { width: 0, height: 4 },
			shadowOpacity: 0.15,
			shadowRadius: 8,
			elevation: 2,
		},
		preferenceButtonLabel: {
			fontSize: scaleFont(14, fontScale),
			fontWeight: "600",
			color: theme.textSecondary,
		},
		preferenceButtonLabelActive: {
			color: theme.accentContrast,
		},
		fontPreviewRow: {
			flexDirection: "row",
			alignItems: "flex-end",
			gap: 8,
		},
		fontPreviewText: {
			fontSize: scaleFont(18, fontScale),
			fontWeight: "700",
			color: theme.textPrimary,
		},
		fontPreviewCaption: {
			fontSize: scaleFont(13, fontScale),
			color: theme.textSecondary,
			marginBottom: 2,
		},
	});
