import { Dimensions, StyleSheet } from "react-native";

const NAVIGATION_BAR_HEIGHT = 96;
const WINDOW_HEIGHT = Dimensions.get("window").height;
const CARD_HEIGHT = Math.max(0, WINDOW_HEIGHT - NAVIGATION_BAR_HEIGHT);

export const styles = StyleSheet.create({
	resultCard: {
		backgroundColor: "#ffffff",
		borderRadius: 16,
		padding: 20,
		marginBottom: 16,
		borderWidth: 1,
		borderColor: "#e5e7eb",
		// height: CARD_HEIGHT,
		maxHeight: CARD_HEIGHT,
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
	definitionHint: {
		fontSize: 13,
		color: "#6b7280",
		marginTop: 4,
	},
	exampleText: {
		fontSize: 14,
		color: "#6b7280",
		marginTop: 4,
	},
	exampleSkeleton: {
		height: 14,
		backgroundColor: "#e5e7eb",
		borderRadius: 8,
		marginTop: 6,
		width: "70%",
	},
	noExampleText: {
		fontSize: 14,
		color: "#6b7280",
		marginTop: 12,
	},
	exampleToggleButton: {
		marginTop: 16,
		backgroundColor: "#4f46e5",
		paddingVertical: 12,
		borderRadius: 12,
		alignItems: "center",
	},
	exampleToggleButtonDisabled: {
		backgroundColor: "#e5e7eb",
	},
	exampleToggleButtonText: {
		color: "#ffffff",
		fontWeight: "600",
	},
	exampleToggleButtonTextDisabled: {
		color: "#6b7280",
	},
});
