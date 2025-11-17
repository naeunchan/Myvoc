import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { LoginScreenProps } from "@/screens/Auth/LoginScreen.types";

export type AuthStackParamList = {
	Login: undefined;
	PasswordReset: {
		initialEmail?: string;
	};
};

export type AuthNavigatorProps = {
	loginProps: LoginScreenProps;
	onResetPassword: (email: string) => Promise<void>;
};

export type PasswordResetScreenRouteProps = NativeStackScreenProps<AuthStackParamList, "PasswordReset">;
