import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
	safeArea: {
		flex: 1,
		backgroundColor: "#e8efff",
	},
	scrollContent: {
		paddingHorizontal: 20,
		paddingTop: 24,
		paddingBottom: 40,
		gap: 20,
	},
	header: {
		gap: 4,
	},
	title: {
		fontSize: 28,
		fontWeight: "800",
		color: "#0f172a",
	},
	subtitle: {
		fontSize: 15,
		color: "#475569",
	},
	modeSection: {
		backgroundColor: "#ffffff",
		borderRadius: 24,
		padding: 20,
		shadowColor: "#0f172a",
		shadowOffset: { width: 0, height: 8 },
		shadowOpacity: 0.08,
		shadowRadius: 12,
		elevation: 6,
		gap: 12,
	},
	sectionLabel: {
		fontSize: 14,
		fontWeight: "700",
		color: "#475569",
	},
	modeButtons: {
		flexDirection: "row",
		gap: 12,
	},
	modeButton: {
		flex: 1,
		paddingVertical: 12,
		borderRadius: 16,
		backgroundColor: "#f1f5f9",
		alignItems: "center",
		justifyContent: "center",
	},
	modeButtonActive: {
		backgroundColor: "#1d4ed8",
	},
	modeButtonDisabled: {
		opacity: 0.6,
	},
	modeButtonLabel: {
		fontSize: 15,
		fontWeight: "700",
		color: "#0f172a",
	},
	modeButtonLabelActive: {
		color: "#ffffff",
	},
	modeButtonLabelDisabled: {
		color: "#94a3b8",
	},
	resultsWrapper: {
		marginTop: 8,
	},
	placeholderCard: {
		backgroundColor: "#ffffff",
		borderRadius: 24,
		padding: 24,
		gap: 8,
		shadowColor: "#0f172a",
		shadowOffset: { width: 0, height: 10 },
		shadowOpacity: 0.08,
		shadowRadius: 14,
		elevation: 6,
	},
	placeholderTitle: {
		fontSize: 18,
		fontWeight: "700",
		color: "#0f172a",
	},
	placeholderSubtitle: {
		fontSize: 14,
		color: "#475569",
	},
	centered: {
		alignItems: "center",
		justifyContent: "center",
		paddingVertical: 24,
	},
	errorText: {
		color: "#dc2626",
		fontWeight: "600",
	},
});
