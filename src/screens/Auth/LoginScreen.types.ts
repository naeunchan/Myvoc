export type LoginScreenProps = {
	onLogin: (username: string, password: string) => void;
	onSignUp: (username: string, password: string, displayName: string) => void;
	onGuest: () => void;
	loading?: boolean;
	errorMessage?: string | null;
};
