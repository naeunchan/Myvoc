export const GOOGLE_USERNAME_MIN_LENGTH = 6;
export const GOOGLE_USERNAME_MAX_LENGTH = 30;

export function getGoogleUsernameValidationError(username: string): string | null {
	if (!username) {
		return "아이디를 입력해주세요.";
	}
	const lowercaseUsername = username.toLowerCase();
	if (username !== lowercaseUsername) {
		return "아이디는 영문 소문자, 숫자, 마침표만 사용할 수 있어요.";
	}
	if (lowercaseUsername.length < GOOGLE_USERNAME_MIN_LENGTH || lowercaseUsername.length > GOOGLE_USERNAME_MAX_LENGTH) {
		return `아이디는 ${GOOGLE_USERNAME_MIN_LENGTH}자 이상 ${GOOGLE_USERNAME_MAX_LENGTH}자 이하로 입력해주세요.`;
	}
	if (!/^[a-z0-9.]+$/.test(lowercaseUsername)) {
		return "아이디는 영문 소문자, 숫자, 마침표만 사용할 수 있어요.";
	}
	if (lowercaseUsername.startsWith(".") || lowercaseUsername.endsWith(".")) {
		return "아이디는 마침표로 시작하거나 끝날 수 없어요.";
	}
	if (lowercaseUsername.includes("..")) {
		return "아이디에는 연속된 마침표를 사용할 수 없어요.";
	}
	return null;
}

export function getGooglePasswordValidationError(password: string): string | null {
	if (!password) {
		return "비밀번호를 입력해주세요.";
	}
	if (password.length < 8) {
		return "비밀번호는 8자 이상이어야 해요.";
	}
	if (/\s/.test(password)) {
		return "비밀번호에는 공백을 사용할 수 없어요.";
	}
	const hasLetter = /[A-Za-z]/.test(password);
	const hasNumber = /[0-9]/.test(password);
	if (!hasLetter || !hasNumber) {
		return "비밀번호에는 영문과 숫자를 모두 포함해야 해요.";
	}
	return null;
}
