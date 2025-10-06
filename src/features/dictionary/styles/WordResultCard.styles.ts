import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
	resultCard: {
		backgroundColor: "#ffffff",
		borderRadius: 16,
		padding: 20,
		marginBottom: 24,
		borderWidth: 1,
		borderColor: "#e5e7eb",
		maxHeight: 320,
	},
	resultHeader: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "flex-start",
		marginBottom: 12,
	},
	resultActions: {
		flexDirection: "row",
		alignItems: "center",
	},
	actionButton: {
		backgroundColor: "#eef2ff",
		paddingHorizontal: 12,
		paddingVertical: 8,
		borderRadius: 10,
		marginLeft: 8,
	},
	actionButtonText: {
		color: "#3730a3",
		fontWeight: "600",
	},
	wordText: {
		fontSize: 22,
		fontWeight: "700",
		color: "#111827",
	},
	phoneticText: {
		fontSize: 16,
		color: "#6b7280",
		marginTop: 4,
	},
	meaningScroll: {
		marginTop: 8,
	},
	meaningContent: {
		paddingBottom: 4,
	},
	meaningBlock: {
		marginBottom: 12,
	},
	partOfSpeech: {
		fontSize: 15,
		fontWeight: "600",
		color: "#4b5563",
		marginBottom: 4,
		textTransform: "capitalize",
	},
	definitionRow: {
		marginBottom: 8,
	},
	definitionText: {
		fontSize: 15,
		color: "#111827",
	},
	exampleText: {
		fontSize: 14,
		color: "#6b7280",
		marginTop: 4,
	},
});
