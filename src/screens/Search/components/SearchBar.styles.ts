import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
	searchBox: {
		flexDirection: "row",
		alignItems: "center",
		marginBottom: 12,
	},
	searchInput: {
		flex: 1,
		backgroundColor: "#ffffff",
		paddingHorizontal: 16,
		paddingVertical: 12,
		borderRadius: 12,
		borderWidth: 1,
		borderColor: "#e5e7eb",
		fontSize: 16,
	},
	searchButton: {
		backgroundColor: "#2f80ed",
		paddingHorizontal: 20,
		paddingVertical: 12,
		borderRadius: 12,
		marginLeft: 12,
	},
	searchButtonText: {
		color: "#ffffff",
		fontWeight: "600",
	},
});
