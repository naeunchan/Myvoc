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
	description: {
		fontSize: 15,
		color: "#4b5563",
		marginBottom: 24,
	},
	homeButton: {
		marginTop: 32,
		backgroundColor: "#2563eb",
		paddingVertical: 14,
		borderRadius: 12,
		alignItems: "center",
	},
	homeButtonText: {
		color: "#ffffff",
		fontSize: 16,
		fontWeight: "600",
	},
});
