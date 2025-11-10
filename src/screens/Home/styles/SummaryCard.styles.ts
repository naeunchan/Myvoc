import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
	card: {
		backgroundColor: "#ffffff",
		borderRadius: 26,
		padding: 24,
		shadowColor: "#0f172a",
		shadowOffset: { width: 0, height: 12 },
		shadowOpacity: 0.08,
		shadowRadius: 18,
		elevation: 6,
		gap: 16,
	},
	header: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
	},
	sectionLabel: {
		fontSize: 13,
		color: "#94a3b8",
		fontWeight: "700",
		textTransform: "uppercase",
		letterSpacing: 0.8,
		marginBottom: 6,
	},
	greeting: {
		fontSize: 18,
		fontWeight: "700",
		color: "#0f172a",
	},
	modeBadge: {
		backgroundColor: "#dbeafe",
		borderRadius: 999,
		paddingHorizontal: 14,
		paddingVertical: 6,
	},
	modeBadgeText: {
		fontSize: 13,
		fontWeight: "700",
		color: "#1d4ed8",
	},
	grid: {
		flexDirection: "row",
		flexWrap: "wrap",
		gap: 12,
	},
	statCard: {
		flexGrow: 1,
		minWidth: "45%",
		backgroundColor: "#f8fafc",
		borderRadius: 18,
		paddingVertical: 16,
		paddingHorizontal: 18,
	},
	statLabel: {
		fontSize: 13,
		color: "#475569",
		marginBottom: 6,
	},
	statValue: {
		fontSize: 20,
		fontWeight: "800",
		color: "#0f172a",
	},
	footer: {
		borderTopWidth: 1,
		borderTopColor: "#e2e8f0",
		paddingTop: 12,
	},
	footerLabel: {
		fontSize: 13,
		color: "#94a3b8",
		marginBottom: 4,
	},
	footerValue: {
		fontSize: 15,
		color: "#0f172a",
		fontWeight: "600",
	},
});
