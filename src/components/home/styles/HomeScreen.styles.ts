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
		marginBottom: 12,
	},
	subtitle: {
		fontSize: 16,
		color: "#4b5563",
		marginBottom: 24,
	},
	card: {
		backgroundColor: "#ffffff",
		borderRadius: 16,
		padding: 20,
		borderWidth: 1,
		borderColor: "#e5e7eb",
		marginBottom: 16,
	},
	cardTitle: {
		fontSize: 18,
		fontWeight: "600",
		color: "#1f2937",
		marginBottom: 12,
	},
	cardText: {
		fontSize: 15,
		color: "#374151",
		marginBottom: 6,
	},
});
