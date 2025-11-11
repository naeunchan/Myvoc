import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
	safeArea: {
		flex: 1,
		backgroundColor: "#f2f2f7",
	},
	scrollContent: {
		paddingHorizontal: 16,
		paddingVertical: 24,
		gap: 24,
	},
	profileCard: {
		backgroundColor: "#ffffff",
		borderRadius: 20,
		padding: 20,
		flexDirection: "row",
		alignItems: "center",
		gap: 16,
		shadowColor: "rgba(15,23,42,0.08)",
		shadowOffset: { width: 0, height: 8 },
		shadowOpacity: 1,
		shadowRadius: 16,
		elevation: 4,
	},
	profileAvatar: {
		width: 56,
		height: 56,
		borderRadius: 28,
		backgroundColor: "#3478f6",
		alignItems: "center",
		justifyContent: "center",
	},
	profileAvatarInitial: {
		color: "#ffffff",
		fontSize: 20,
		fontWeight: "700",
	},
	profileInfo: {
		flex: 1,
	},
	profileName: {
		fontSize: 18,
		fontWeight: "700",
		color: "#0f172a",
	},
	profileSubtitle: {
		fontSize: 14,
		color: "#6b7280",
		marginTop: 2,
	},
	profileAction: {
		paddingHorizontal: 14,
		paddingVertical: 8,
		borderRadius: 16,
		backgroundColor: "#e7f0ff",
	},
	profileActionText: {
		fontSize: 13,
		fontWeight: "600",
		color: "#1d4ed8",
	},
	section: {
		gap: 8,
	},
	sectionLabel: {
		fontSize: 13,
		color: "#6b7280",
		textTransform: "uppercase",
		letterSpacing: 0.5,
		marginLeft: 4,
	},
	sectionCard: {
		backgroundColor: "#ffffff",
		borderRadius: 18,
		overflow: "hidden",
		shadowColor: "rgba(15,23,42,0.05)",
		shadowOffset: { width: 0, height: 6 },
		shadowOpacity: 1,
		shadowRadius: 12,
		elevation: 3,
	},
	row: {
		flexDirection: "row",
		alignItems: "center",
		paddingHorizontal: 16,
		paddingVertical: 14,
		backgroundColor: "#ffffff",
	},
	rowBorder: {
		borderBottomWidth: 1,
		borderBottomColor: "#efeff4",
	},
	rowLabel: {
		flex: 1,
		fontSize: 16,
		color: "#111827",
	},
	rowValue: {
		fontSize: 16,
		color: "#6b7280",
	},
	rowChevron: {
		fontSize: 20,
		color: "#cbd5f5",
	},
	rowDisabled: {
		opacity: 0.6,
	},
	rowDangerText: {
		color: "#ef4444",
	},
	guestCard: {
		backgroundColor: "#ffffff",
		borderRadius: 18,
		padding: 20,
		gap: 12,
		shadowColor: "rgba(15,23,42,0.05)",
		shadowOffset: { width: 0, height: 6 },
		shadowOpacity: 1,
		shadowRadius: 12,
		elevation: 3,
	},
	guestTitle: {
		fontSize: 17,
		fontWeight: "700",
		color: "#0f172a",
	},
	guestDescription: {
		fontSize: 14,
		color: "#6b7280",
		lineHeight: 20,
	},
	primaryCta: {
		backgroundColor: "#007aff",
		borderRadius: 14,
		paddingVertical: 14,
		alignItems: "center",
	},
	primaryCtaText: {
		color: "#ffffff",
		fontSize: 16,
		fontWeight: "600",
	},
	secondaryCta: {
		borderWidth: 1,
		borderColor: "#d1d5db",
		borderRadius: 14,
		paddingVertical: 14,
		alignItems: "center",
	},
	secondaryCtaText: {
		color: "#111827",
		fontSize: 16,
		fontWeight: "600",
	},
});
