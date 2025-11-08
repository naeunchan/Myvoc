import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
	container: {
		width: "100%",
	},
	card: {
		backgroundColor: "#ffffff",
		borderRadius: 28,
		padding: 24,
		gap: 20,
		shadowColor: "#0f172a",
		shadowOffset: { width: 0, height: 16 },
		shadowOpacity: 0.08,
		shadowRadius: 20,
		elevation: 6,
	},
	headerSection: {
		alignItems: "center",
		gap: 10,
	},
	word: {
		fontSize: 32,
		fontWeight: "800",
		color: "#0f172a",
		textAlign: "center",
	},
	phonetic: {
		fontSize: 18,
		color: "#475569",
		textAlign: "center",
	},
	meaningContainer: {
		padding: 18,
		backgroundColor: "#f1f5f9",
		borderRadius: 20,
		minHeight: 150,
	},
	meaningScroll: {
		maxHeight: 220,
	},
	meaningContent: {
		paddingBottom: 4,
	},
	meaningText: {
		fontSize: 16,
		color: "#0f172a",
		lineHeight: 22,
		textAlign: "center",
	},
	actions: {
		flexDirection: "row",
		flexWrap: "wrap",
		justifyContent: "center",
		columnGap: 16,
		rowGap: 12,
	},
	actionButton: {
		width: 56,
		height: 56,
		borderRadius: 18,
		backgroundColor: "#eef2ff",
		alignItems: "center",
		justifyContent: "center",
		shadowColor: "#0f172a",
		shadowOffset: { width: 0, height: 8 },
		shadowOpacity: 0.08,
		shadowRadius: 12,
		elevation: 4,
	},
});
