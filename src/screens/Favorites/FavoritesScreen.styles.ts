import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
	safeArea: {
		flex: 1,
		backgroundColor: "#f7f9fc",
		paddingTop: 12,
	},
	content: {
		flex: 1,
		paddingHorizontal: 20,
		paddingTop: 32,
		paddingBottom: 24,
	},
	title: {
		fontSize: 24,
		fontWeight: "700",
		color: "#1f2937",
		marginBottom: 16,
	},
	segmentedControl: {
		flexDirection: "row",
		backgroundColor: "#e5e7eb",
		padding: 4,
		borderRadius: 999,
		marginBottom: 24,
		gap: 4,
	},
	segmentButton: {
		flex: 1,
		borderRadius: 999,
		paddingVertical: 8,
		alignItems: "center",
	},
	segmentButtonActive: {
		backgroundColor: "#2563eb",
	},
	segmentButtonText: {
		fontSize: 14,
		fontWeight: "600",
		color: "#1f2937",
	},
	segmentButtonTextActive: {
		color: "#ffffff",
	},
	emptyText: {
		fontSize: 16,
		color: "#6b7280",
		marginTop: 32,
		textAlign: "center",
	},
});
