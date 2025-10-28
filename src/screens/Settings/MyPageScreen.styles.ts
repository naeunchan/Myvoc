import { StyleSheet } from "react-native";

export const myPageStyles = StyleSheet.create({
	safeArea: {
		flex: 1,
		backgroundColor: "#f7f9fc",
	},
	scrollContent: {
		flexGrow: 1,
		paddingHorizontal: 20,
		gap: 24,
	},
	header: {
		gap: 6,
	},
	title: {
		fontSize: 24,
		fontWeight: "700",
		color: "#1f2937",
	},
	subtitle: {
		fontSize: 15,
		color: "#4b5563",
	},
	caption: {
		fontSize: 13,
		color: "#6b7280",
	},
	section: {
		backgroundColor: "#ffffff",
		borderRadius: 16,
		paddingVertical: 20,
		paddingHorizontal: 18,
		borderWidth: 1,
		borderColor: "#e5e7eb",
		gap: 14,
	},
	sectionTitle: {
		fontSize: 18,
		fontWeight: "700",
		color: "#111827",
	},
	sectionDescription: {
		fontSize: 14,
		color: "#6b7280",
		lineHeight: 20,
	},
	actionList: {
		borderWidth: 1,
		borderColor: "#e5e7eb",
		borderRadius: 16,
		overflow: "hidden",
	},
	actionItem: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
		paddingVertical: 18,
		paddingHorizontal: 18,
		backgroundColor: "#ffffff",
	},
	actionTextContainer: {
		gap: 4,
		flex: 1,
	},
	actionTitle: {
		fontSize: 16,
		fontWeight: "600",
		color: "#111827",
	},
	actionSubtitle: {
		fontSize: 13,
		color: "#6b7280",
	},
	actionChevron: {
		fontSize: 20,
		color: "#9ca3af",
		marginLeft: 12,
	},
	actionDivider: {
		height: 1,
		backgroundColor: "#e5e7eb",
		marginHorizontal: 18,
	},
	input: {
		borderWidth: 1,
		borderColor: "#d1d5db",
		borderRadius: 12,
		paddingHorizontal: 14,
		paddingVertical: 12,
		fontSize: 16,
		color: "#111827",
	},
	errorText: {
		fontSize: 13,
		color: "#ef4444",
	},
	submitButton: {
		backgroundColor: "#2563eb",
		borderRadius: 12,
		paddingVertical: 14,
		alignItems: "center",
	},
	submitButtonDisabled: {
		opacity: 0.7,
	},
	submitButtonText: {
		fontSize: 16,
		fontWeight: "600",
		color: "#ffffff",
	},
});
