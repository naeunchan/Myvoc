import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
	container: {
		flexDirection: "row",
		alignItems: "center",
		backgroundColor: "#e5e7eb",
		borderRadius: 12,
		padding: 4,
		marginBottom: 16,
	},
	button: {
		flex: 1,
		paddingVertical: 10,
		borderRadius: 10,
		alignItems: "center",
	},
	disabledButton: {
		opacity: 0.5,
	},
	activeButton: {
		backgroundColor: "#ffffff",
		shadowColor: "#000000",
		shadowOffset: { width: 0, height: 1 },
		shadowOpacity: 0.05,
		shadowRadius: 2,
		elevation: 1,
	},
	label: {
		fontSize: 14,
		fontWeight: "600",
		color: "#6b7280",
	},
	activeLabel: {
		color: "#1f2937",
	},
	disabledLabel: {
		color: "#9ca3af",
	},
});
