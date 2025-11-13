export type SocialLoginProfile = {
	provider: "google" | "apple";
	id: string;
	email?: string | null;
	name?: string | null;
};

export type LoginScreenProps = {
	onLogin: (username: string, password: string, options?: { rememberMe?: boolean }) => void;
	onSignUp: (
		username: string,
		password: string,
		displayName: string,
		options?: { rememberMe?: boolean },
	) => void;
	onGuest: () => void;
	onSocialLogin: (profile: SocialLoginProfile) => void;
	onResetPassword: (username: string, newPassword: string) => Promise<void>;
	loading?: boolean;
	errorMessage?: string | null;
	initialMode?: "login" | "signup";
};
