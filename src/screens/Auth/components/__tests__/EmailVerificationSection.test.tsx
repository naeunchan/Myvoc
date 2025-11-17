import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import { EmailVerificationSection } from "@/screens/Auth/components/EmailVerificationSection";

const createProps = () => ({
	status: "idle" as const,
	code: "",
	errorMessage: null,
	hintMessage: "힌트",
	sending: false,
	verifying: false,
	canSend: true,
	canVerify: true,
	disabled: false,
	onChangeCode: jest.fn(),
	onSendCode: jest.fn(),
	onVerifyCode: jest.fn(),
});

describe("EmailVerificationSection", () => {
	it("allows entering a code and triggers callbacks", () => {
		const props = createProps();
		const { getByPlaceholderText, getByText } = render(<EmailVerificationSection {...props} />);

		fireEvent.changeText(getByPlaceholderText("6자리 인증 코드를 입력하세요"), "123456");
		expect(props.onChangeCode).toHaveBeenCalledWith("123456");

		fireEvent.press(getByText("인증 메일 보내기"));
		expect(props.onSendCode).toHaveBeenCalled();

		fireEvent.press(getByText("인증 확인"));
		expect(props.onVerifyCode).toHaveBeenCalled();
	});

	it("updates send button label when a code was sent", () => {
		const props = { ...createProps(), status: "sent" as const };
		const { getByText, getByTestId } = render(<EmailVerificationSection {...props} />);

		expect(getByText("인증 메일 재전송")).toBeTruthy();
	});

	it("shows success state and disables further actions once verified", () => {
		const props = {
			...createProps(),
			status: "verified" as const,
			code: "123456",
			hintMessage: null,
		};
		const { getByText, getByTestId } = render(<EmailVerificationSection {...props} />);

		expect(getByText("이메일 인증이 완료되었어요.")).toBeTruthy();
		const verifyButton = getByText("인증 완료");
		expect(verifyButton).toBeTruthy();
		const verifyTouchable = getByTestId("email-verification-verify-button");
		expect(verifyTouchable.props.accessibilityState?.disabled).toBe(true);
		const sendTouchable = getByTestId("email-verification-send-button");
		expect(sendTouchable.props.accessibilityState?.disabled).toBe(true);
	});
});
