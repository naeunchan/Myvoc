import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
	container: {
		backgroundColor: "#0f172a",
		borderRadius: 28,
		padding: 24,
		shadowColor: "#0f172a",
		shadowOffset: { width: 0, height: 16 },
		shadowOpacity: 0.15,
		shadowRadius: 24,
		elevation: 8,
		gap: 12,
	},
	badge: {
		alignSelf: "flex-start",
		backgroundColor: "rgba(255,255,255,0.12)",
		borderRadius: 999,
		paddingHorizontal: 14,
		paddingVertical: 6,
		color: "#c7d2fe",
		fontSize: 12,
		fontWeight: "700",
		textTransform: "uppercase",
	},
	title: {
		fontSize: 26,
		fontWeight: "800",
		color: "#ffffff",
		lineHeight: 32,
	},
	subtitle: {
		fontSize: 15,
		color: "#cbd5f5",
	},
});
