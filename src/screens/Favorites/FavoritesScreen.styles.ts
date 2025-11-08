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
	heroCard: {
		backgroundColor: "#1d4ed8",
		borderRadius: 28,
		padding: 24,
		gap: 8,
		shadowColor: "#0f172a",
		shadowOffset: { width: 0, height: 16 },
		shadowOpacity: 0.18,
		shadowRadius: 24,
		elevation: 8,
	},
	heroTitle: {
		fontSize: 26,
		fontWeight: "800",
		color: "#ffffff",
	},
	heroSubtitle: {
		fontSize: 15,
		color: "#dbeafe",
	},
	segmentCard: {
		backgroundColor: "#ffffff",
		borderRadius: 24,
		padding: 20,
		shadowColor: "#0f172a",
		shadowOffset: { width: 0, height: 10 },
		shadowOpacity: 0.08,
		shadowRadius: 16,
		elevation: 6,
		gap: 12,
	},
	segmentLabel: {
		fontSize: 14,
		fontWeight: "700",
		color: "#475569",
	},
	segmentedControl: {
		flexDirection: "row",
		backgroundColor: "#e0edff",
		padding: 4,
		borderRadius: 999,
		gap: 6,
	},
	segmentButton: {
		flex: 1,
		borderRadius: 999,
		paddingVertical: 10,
		alignItems: "center",
	},
	segmentButtonActive: {
		backgroundColor: "#1d4ed8",
	},
	segmentButtonText: {
		fontSize: 14,
		fontWeight: "700",
		color: "#1d4ed8",
	},
	segmentButtonTextActive: {
		color: "#ffffff",
	},
	emptyCard: {
		backgroundColor: "#ffffff",
		borderRadius: 24,
		padding: 24,
		alignItems: "flex-start",
		gap: 8,
		shadowColor: "#0f172a",
		shadowOffset: { width: 0, height: 10 },
		shadowOpacity: 0.08,
		shadowRadius: 16,
		elevation: 6,
	},
	emptyTitle: {
		fontSize: 18,
		fontWeight: "700",
		color: "#0f172a",
	},
	emptySubtitle: {
		fontSize: 14,
		color: "#475569",
	},
});
