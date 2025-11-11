import { StyleSheet } from "react-native";

export const appHelpModalStyles = StyleSheet.create({
	backdrop: {
		flex: 1,
		backgroundColor: "rgba(17, 24, 39, 0.6)",
		alignItems: "center",
		justifyContent: "center",
		padding: 24,
	},
	container: {
		width: "100%",
		maxWidth: 440,
		backgroundColor: "#ffffff",
		borderRadius: 20,
		paddingHorizontal: 24,
		paddingTop: 24,
		paddingBottom: 16,
		shadowColor: "#000000",
		shadowOpacity: 0.2,
		shadowRadius: 24,
		shadowOffset: { width: 0, height: 8 },
		elevation: 8,
	},
	scrollView: {
		maxHeight: 420,
	},
	scrollContent: {
		paddingBottom: 8,
	},
	title: {
		fontSize: 20,
		fontWeight: "700",
		color: "#111827",
		marginBottom: 12,
	},
	description: {
		fontSize: 14,
		color: "#374151",
		lineHeight: 20,
		marginBottom: 20,
	},
	section: {
		marginBottom: 16,
	},
	sectionTitle: {
		fontSize: 16,
		fontWeight: "600",
		color: "#111827",
		marginBottom: 6,
	},
	sectionBody: {
		fontSize: 14,
		color: "#4b5563",
		lineHeight: 20,
	},
	button: {
		marginTop: 12,
		backgroundColor: "#2563eb",
		borderRadius: 12,
		paddingVertical: 14,
		alignItems: "center",
	},
	buttonPressed: {
		opacity: 0.85,
	},
	buttonText: {
		fontSize: 15,
		fontWeight: "600",
		color: "#ffffff",
	},
});
