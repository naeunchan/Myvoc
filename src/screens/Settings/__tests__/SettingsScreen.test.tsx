import React from "react";
import { act, fireEvent, render } from "@testing-library/react-native";
import { Alert, Linking } from "react-native";
import { SettingsScreen } from "@/screens/Settings/SettingsScreen";

jest.mock("@/screens/Settings/components/GuestActionCard", () => ({
	GuestActionCard: () => null,
}));

jest.mock("@/screens/Settings/components/AuthenticatedActions", () => ({
	AuthenticatedActions: () => null,
}));

describe("SettingsScreen", () => {
	const baseProps = {
		onLogout: jest.fn(),
		canLogout: true,
		isGuest: false,
		onRequestLogin: jest.fn(),
		onRequestSignUp: jest.fn(),
		onShowHelp: jest.fn(),
		appVersion: "1.0.0",
		profileUsername: "alex",
		onNavigateProfile: jest.fn(),
	};

beforeEach(() => {
	jest.clearAllMocks();
});

afterEach(() => {
	jest.restoreAllMocks();
});

	it("opens mail composer when contact card pressed", async () => {
		jest.spyOn(Linking, "canOpenURL").mockResolvedValue(true);
		jest.spyOn(Linking, "openURL").mockResolvedValue();

		const { getByText } = render(<SettingsScreen {...baseProps} />);

		await act(async () => {
			fireEvent.press(getByText("1:1 문의 보내기"));
		});

		expect(Linking.canOpenURL).toHaveBeenCalled();
		expect(Linking.openURL).toHaveBeenCalledWith(expect.stringContaining("mailto:support@myvoc.app"));
	});

	it("shows alert when mail composer unavailable", async () => {
		jest.spyOn(Linking, "canOpenURL").mockResolvedValue(false);
		const alertSpy = jest.spyOn(Alert, "alert").mockImplementation(() => {});

		const { getByText } = render(<SettingsScreen {...baseProps} />);

		await act(async () => {
			fireEvent.press(getByText("1:1 문의 보내기"));
		});

		expect(alertSpy).toHaveBeenCalledWith("문의하기", expect.stringContaining("support@myvoc.app"));
	});
});
