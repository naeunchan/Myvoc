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
	guestCard: {
		backgroundColor: "#ffffff",
		padding: 20,
		borderRadius: 16,
		gap: 16,
	},
	guestTitle: {
		fontSize: 18,
		fontWeight: "600",
		color: "#1f2937",
	},
	guestDescription: {
		fontSize: 14,
		color: "#4b5563",
		lineHeight: 20,
	},
	primaryCta: {
		backgroundColor: "#2563eb",
		paddingVertical: 14,
		borderRadius: 12,
		alignItems: "center",
	},
	primaryCtaText: {
		color: "#ffffff",
		fontSize: 16,
		fontWeight: "600",
	},
	secondaryCta: {
		borderWidth: 1,
		borderColor: "#d1d5db",
		paddingVertical: 14,
		borderRadius: 12,
		alignItems: "center",
	},
	secondaryCtaText: {
		color: "#1f2937",
		fontSize: 16,
		fontWeight: "600",
	},
	logoutButton: {
		marginTop: 24,
		marginBottom: 16,
		backgroundColor: "#ef4444",
		paddingVertical: 14,
		borderRadius: 12,
		alignItems: "center",
	},
	logoutButtonText: {
		color: "#ffffff",
		fontSize: 16,
		fontWeight: "600",
	},
	homeButton: {
		marginTop: 24,
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
