type AuthMode = "login" | "signup";

export function getLoginCopy(mode: AuthMode) {
	const isLogin = mode === "login";

	return {
		title: isLogin ? "다시 만나서 반가워요!" : "처음 오셨군요!",
		subtitle: isLogin
			? "계정으로 로그인하거나, 게스트로 간단히 체험해보세요."
			: "간단히 회원가입하고 모든 기능을 이용해보세요.",
		primaryButton: isLogin ? "로그인" : "회원가입",
		helperText: isLogin
			? "로그인하면 단어 저장, 즐겨찾기 동기화 등 모든 기능을 사용할 수 있어요."
			: "회원가입을 완료하면 자동으로 로그인되어 바로 사용할 수 있어요.",
		togglePrompt: isLogin ? "아직 계정이 없으신가요?" : "이미 계정이 있으신가요?",
		toggleAction: isLogin ? "회원가입" : "로그인",
	};
}
