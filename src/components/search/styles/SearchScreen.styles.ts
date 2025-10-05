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
	centered: {
		alignItems: "center",
		marginVertical: 16,
	},
	errorText: {
		color: "#ef4444",
		marginBottom: 12,
	},
	spacer: {
		height: 16,
	},
});
