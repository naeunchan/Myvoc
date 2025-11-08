import { Dimensions, StyleSheet } from "react-native";

const WINDOW_HEIGHT = Dimensions.get("window").height;
const CARD_HEIGHT = Math.max(0, WINDOW_HEIGHT - 180);

export const styles = StyleSheet.create({
	resultCard: {
		backgroundColor: "#ffffff",
		borderRadius: 28,
		padding: 24,
		marginBottom: 24,
		shadowColor: "#0f172a",
		shadowOffset: { width: 0, height: 16 },
		shadowOpacity: 0.08,
		shadowRadius: 20,
		elevation: 8,
		maxHeight: CARD_HEIGHT,
	},
	resultHeader: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "flex-start",
		marginBottom: 16,
	},
	cardLabel: {
		fontSize: 12,
		fontWeight: "700",
		color: "#94a3b8",
		letterSpacing: 1.2,
		textTransform: "uppercase",
		marginBottom: 6,
	},
	resultActions: {
		flexDirection: "row",
		alignItems: "center",
		gap: 8,
	},
	iconButton: {
		width: 40,
		height: 40,
		borderRadius: 14,
		backgroundColor: "#eef2ff",
		alignItems: "center",
		justifyContent: "center",
	},
	wordText: {
		fontSize: 32,
		fontWeight: "800",
		color: "#0f172a",
	},
	phoneticText: {
		fontSize: 16,
		color: "#475569",
		marginTop: 4,
	},
	meaningScroll: {
		marginTop: 8,
	},
	meaningContent: {
		paddingBottom: 16,
	},
	meaningBlock: {
		marginBottom: 20,
		gap: 12,
	},
	meaningHeaderRow: {
		flexDirection: "row",
		alignItems: "center",
		gap: 12,
	},
	partOfSpeech: {
		fontSize: 14,
		fontWeight: "700",
		color: "#1d4ed8",
		textTransform: "capitalize",
	},
	meaningDivider: {
		height: 1,
		backgroundColor: "#e2e8f0",
		flex: 1,
	},
	definitionRow: {
		flexDirection: "row",
		gap: 12,
		marginBottom: 16,
		alignItems: "flex-start",
	},
	definitionIndex: {
		width: 28,
		height: 28,
		borderRadius: 14,
		backgroundColor: "#eff6ff",
		alignItems: "center",
		justifyContent: "center",
	},
	definitionIndexText: {
		fontWeight: "700",
		color: "#1d4ed8",
	},
	definitionBody: {
		flex: 1,
		gap: 6,
	},
	definitionText: {
		fontSize: 16,
		fontWeight: "600",
		color: "#0f172a",
	},
	definitionHint: {
		fontSize: 13,
		color: "#475569",
	},
	exampleText: {
		fontSize: 14,
		color: "#475569",
		marginTop: 4,
	},
	exampleSkeleton: {
		height: 14,
		backgroundColor: "#e2e8f0",
		borderRadius: 8,
		marginTop: 6,
		width: "70%",
	},
	noExampleText: {
		fontSize: 14,
		color: "#94a3b8",
		marginTop: 12,
	},
	exampleToggleButton: {
		marginTop: 12,
		backgroundColor: "#0f172a",
		paddingVertical: 12,
		borderRadius: 16,
		alignItems: "center",
		justifyContent: "center",
		flexDirection: "row",
		gap: 8,
	},
	exampleToggleButtonDisabled: {
		backgroundColor: "#e2e8f0",
	},
	exampleToggleButtonText: {
		color: "#ffffff",
		fontWeight: "700",
	},
	exampleToggleButtonTextDisabled: {
		color: "#94a3b8",
	},
});
