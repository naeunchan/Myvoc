import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
	container: {
		backgroundColor: "#ffffff",
		borderRadius: 26,
		padding: 20,
		shadowColor: "#0f172a",
		shadowOffset: { width: 0, height: 10 },
		shadowOpacity: 0.08,
		shadowRadius: 16,
		elevation: 6,
		gap: 12,
	},
	header: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "flex-start",
	},
	sectionLabel: {
		fontSize: 13,
		color: "#94a3b8",
		fontWeight: "700",
		textTransform: "uppercase",
		letterSpacing: 0.8,
		marginBottom: 6,
	},
	subtitle: {
		fontSize: 14,
		color: "#475569",
		marginTop: 4,
	},
	count: {
		fontSize: 24,
		fontWeight: "800",
		color: "#1d4ed8",
	},
	list: {
		marginTop: 8,
	},
	listContent: {
		paddingBottom: 4,
	},
	itemRow: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		paddingVertical: 12,
	},
	itemText: {
		flex: 1,
		paddingRight: 12,
	},
	word: {
		fontSize: 16,
		fontWeight: "700",
		color: "#0f172a",
		marginBottom: 4,
	},
	phonetic: {
		fontSize: 13,
		color: "#475569",
		marginBottom: 4,
	},
	definition: {
		fontSize: 14,
		color: "#334155",
	},
	actions: {
		flexDirection: "row",
		alignItems: "center",
		columnGap: 8,
	},
	actionButton: {
		width: 40,
		height: 40,
		borderRadius: 12,
		backgroundColor: "#eef2ff",
		alignItems: "center",
		justifyContent: "center",
	},
	separator: {
		height: 1,
		backgroundColor: "#e2e8f0",
	},
	emptyText: {
		fontSize: 15,
		color: "#94a3b8",
		textAlign: "center",
		paddingVertical: 24,
	},
});
