import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
	card: {
		backgroundColor: "#ffffff",
		borderRadius: 24,
		padding: 20,
		shadowColor: "#0f172a",
		shadowOffset: { width: 0, height: 10 },
		shadowOpacity: 0.08,
		shadowRadius: 14,
		elevation: 6,
		gap: 16,
	},
	cardHeader: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
	},
	cardTitle: {
		fontSize: 16,
		fontWeight: "700",
		color: "#0f172a",
	},
	iconSet: {
		flexDirection: "row",
		gap: 8,
	},
	iconBadge: {
		width: 36,
		height: 36,
		borderRadius: 18,
		backgroundColor: "#eef2ff",
		alignItems: "center",
		justifyContent: "center",
	},
	inputWrapper: {
		minHeight: 36,
	},
	searchInput: {
		flex: 1,
		minHeight: 36,
		fontSize: 20,
		color: "#0f172a",
		fontWeight: "500",
	},
	cardFooter: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
	},
	clearButton: {
		flexDirection: "row",
		alignItems: "center",
		gap: 6,
	},
	clearButtonText: {
		color: "#475569",
		fontWeight: "600",
	},
	clearButtonTextDisabled: {
		color: "#cbd5f5",
	},
	submitButton: {
		backgroundColor: "#2563eb",
		borderRadius: 18,
		paddingVertical: 12,
		paddingHorizontal: 20,
		flexDirection: "row",
		alignItems: "center",
		gap: 8,
	},
	submitButtonText: {
		color: "#ffffff",
		fontSize: 16,
		fontWeight: "700",
	},
});
