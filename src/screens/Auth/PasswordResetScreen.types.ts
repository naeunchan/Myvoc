export type PasswordResetScreenProps = {
	initialEmail?: string;
	onSubmit: (email: string) => Promise<void>;
	onDone: () => void;
};
