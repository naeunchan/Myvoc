import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	card: {
		backgroundColor: "#ffffff",
		borderRadius: 20,
		paddingVertical: 48,
		paddingHorizontal: 24,
		alignItems: "center",
		justifyContent: "center",
		shadowColor: "#000",
		shadowOpacity: 0.05,
		shadowRadius: 12,
		shadowOffset: { width: 0, height: 4 },
		elevation: 4,
	},
	word: {
		fontSize: 32,
		fontWeight: "700",
		color: "#111827",
	},
	meaningContainer: {
		marginTop: 24,
		padding: 20,
		backgroundColor: "#e0f2fe",
		borderRadius: 16,
	},
	meaningLabel: {
		fontSize: 14,
		fontWeight: "600",
		color: "#0369a1",
		marginBottom: 6,
	},
	meaningText: {
		fontSize: 16,
		color: "#0f172a",
		lineHeight: 22,
	},
	actions: {
		marginTop: 32,
		flexDirection: "row",
		justifyContent: "center",
		alignItems: "center",
	},
	actionButton: {
		width: 56,
		height: 56,
		borderRadius: 28,
		alignItems: "center",
		justifyContent: "center",
		backgroundColor: "#ffffff",
		shadowColor: "#000",
		shadowOpacity: 0.08,
		shadowRadius: 10,
		shadowOffset: { width: 0, height: 4 },
		elevation: 3,
		marginHorizontal: 12,
	},
});
