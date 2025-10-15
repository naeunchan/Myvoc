import { StyleSheet } from "react-native";

export const appStyles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#ffffff",
	},
	bannerPlaceholder: {
		height: 80,
		backgroundColor: "#f3f4f6",
		borderBottomWidth: 1,
		borderBottomColor: "#e5e7eb",
		alignItems: "center",
		justifyContent: "center",
	},
	bannerText: {
		fontSize: 14,
		color: "#6b7280",
	},
	content: {
		flex: 1,
	},
	initializingState: {
		flex: 1,
		alignItems: "center",
		justifyContent: "center",
		gap: 12,
	},
	initializingText: {
		fontSize: 15,
		color: "#4b5563",
	},
	versionBadge: {
		alignSelf: "flex-end",
		backgroundColor: "#e5e7eb",
		paddingHorizontal: 12,
		paddingVertical: 6,
		borderRadius: 999,
		margin: 12,
	},
	versionText: {
		fontSize: 12,
		color: "#4b5563",
		fontWeight: "600",
	},
});
