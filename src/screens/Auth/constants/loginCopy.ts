type AuthMode = "login" | "signup";

export function getLoginCopy(mode: AuthMode) {
	const isLogin = mode === "login";

	return {
		title: isLogin ? "다시 만나서 반가워요!" : "처음 오셨군요!",
		subtitle: isLogin ? "계정으로 로그인하거나, 게스트로 간단히 체험해보세요." : "간단히 회원가입하고 모든 기능을 이용해보세요.",
		primaryButton: isLogin ? "로그인" : "회원가입",
		togglePrompt: isLogin ? "아직 계정이 없으신가요?" : "이미 계정이 있으신가요?",
		toggleAction: isLogin ? "회원가입" : "로그인",
	};
}
