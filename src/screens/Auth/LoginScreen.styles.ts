import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
	safeArea: {
		flex: 1,
		backgroundColor: "#ffffff",
	},
	content: {
		flex: 1,
		paddingHorizontal: 24,
		paddingTop: 48,
		paddingBottom: 32,
	},
	title: {
		fontSize: 26,
		fontWeight: "700",
		color: "#111827",
		marginBottom: 8,
	},
	subtitle: {
		fontSize: 16,
		color: "#4b5563",
		marginBottom: 24,
		lineHeight: 22,
	},
	inputLabel: {
		fontSize: 14,
		color: "#374151",
		marginBottom: 8,
		fontWeight: "600",
	},
	textInput: {
		borderWidth: 1,
		borderColor: "#d1d5db",
		borderRadius: 12,
		paddingHorizontal: 16,
		paddingVertical: 12,
		fontSize: 15,
		color: "#111827",
		backgroundColor: "#f9fafb",
		marginBottom: 16,
	},
	button: {
		backgroundColor: "#2563eb",
		paddingVertical: 14,
		borderRadius: 12,
		alignItems: "center",
		marginBottom: 12,
	},
	buttonText: {
		color: "#ffffff",
		fontSize: 16,
		fontWeight: "600",
	},
	ghostButton: {
		borderWidth: 1,
		borderColor: "#2563eb",
		borderRadius: 12,
		paddingVertical: 14,
		alignItems: "center",
	},
	ghostButtonText: {
		color: "#2563eb",
		fontSize: 16,
		fontWeight: "600",
	},
	rememberRow: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
		marginBottom: 16,
	},
	rememberLabel: {
		fontSize: 14,
		color: "#374151",
		fontWeight: "600",
	},
	disabledButton: {
		opacity: 0.6,
	},
	helperText: {
		fontSize: 13,
		color: "#6b7280",
		marginBottom: 24,
		lineHeight: 18,
	},
	errorText: {
		color: "#dc2626",
		fontSize: 14,
		marginBottom: 16,
	},
	ruleText: {
		fontSize: 12,
		color: "#6b7280",
		marginTop: -8,
		marginBottom: 16,
		lineHeight: 16,
	},
	modeSwitch: {
		flexDirection: "row",
		justifyContent: "center",
		alignItems: "center",
		marginTop: 20,
		gap: 6,
	},
	modeSwitchText: {
		fontSize: 14,
		color: "#6b7280",
	},
	modeSwitchAction: {
		fontSize: 14,
		color: "#2563eb",
		fontWeight: "600",
	},
	footerNote: {
		fontSize: 13,
		color: "#6b7280",
		marginTop: 32,
		lineHeight: 20,
	},
	buttonLoadingRow: {
		flexDirection: "row",
		alignItems: "center",
		gap: 8,
	},
	buttonLoadingText: {
		color: "#ffffff",
		fontSize: 16,
		fontWeight: "600",
	},
});
