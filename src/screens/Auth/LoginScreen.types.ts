export type LoginScreenProps = {
	onLogin: (username: string, displayName: string) => void;
	onGuest: () => void;
	loading?: boolean;
	errorMessage?: string | null;
};
