import React from "react";
import { Alert } from "react-native";
import { act, fireEvent, render, waitFor } from "@testing-library/react-native";
import { MyPageScreen } from "@/screens/Settings/MyPageScreen";

const createProps = () => ({
	username: "alex",
	displayName: "Alex",
	onNavigateNickname: jest.fn(),
	onNavigatePassword: jest.fn(),
	onDeleteAccount: jest.fn(() => Promise.resolve()),
});

describe("MyPageScreen", () => {
	afterEach(() => {
		jest.restoreAllMocks();
	});

	it("shows an alert when username is missing for profile navigation", () => {
		const alertSpy = jest.spyOn(Alert, "alert").mockImplementation(() => {});
		const props = { ...createProps(), username: "" };
		const { getByText } = render(<MyPageScreen {...props} />);

		fireEvent.press(getByText("닉네임 수정"));
		expect(alertSpy).toHaveBeenCalledWith("마이 페이지", expect.any(String));
		expect(props.onNavigateNickname).not.toHaveBeenCalled();
	});

	it("confirms and executes account deletion", async () => {
		const alertSpy = jest.spyOn(Alert, "alert").mockImplementation(() => {});
		const props = createProps();
		const { getByText } = render(<MyPageScreen {...props} />);

		fireEvent.press(getByText("회원탈퇴"));
		expect(alertSpy).toHaveBeenCalledWith("회원탈퇴", expect.stringContaining("모두 삭제"));

		const confirmButton = alertSpy.mock.calls[0][2]?.find((action) => action?.style === "destructive");
		expect(confirmButton).toBeDefined();

		await act(async () => {
			await confirmButton?.onPress?.();
		});

		await waitFor(() => {
			expect(props.onDeleteAccount).toHaveBeenCalled();
			expect(alertSpy).toHaveBeenLastCalledWith("회원탈퇴 완료", expect.any(String));
		});
	});
});
