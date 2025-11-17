import React, { useMemo } from "react";
import { DarkTheme as NavigationDarkTheme, DefaultTheme as NavigationDefaultTheme, NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { LoginScreen } from "@/screens/Auth/LoginScreen";
import { PasswordResetScreen } from "@/screens/Auth/PasswordResetScreen";
import { AuthNavigatorProps, AuthStackParamList } from "@/screens/Auth/AuthNavigator.types";
import { useAppAppearance } from "@/theme/AppearanceContext";

const Stack = createNativeStackNavigator<AuthStackParamList>();

export function AuthNavigator({ loginProps, onResetPassword }: AuthNavigatorProps) {
	const { mode, theme } = useAppAppearance();
	const navigationTheme = useMemo(
		() => ({
			...(mode === "dark" ? NavigationDarkTheme : NavigationDefaultTheme),
			colors: {
				...(mode === "dark" ? NavigationDarkTheme.colors : NavigationDefaultTheme.colors),
				background: theme.background,
				card: theme.surface,
				border: theme.border,
				primary: theme.accent,
				text: theme.textPrimary,
			},
		}),
		[mode, theme],
	);

	return (
		<NavigationContainer independent theme={navigationTheme}>
			<Stack.Navigator>
				<Stack.Screen name="Login" options={{ headerShown: false }}>
					{({ navigation }) => (
						<LoginScreen
							{...loginProps}
							onRequestPasswordReset={(email) => {
								navigation.navigate("PasswordReset", { initialEmail: email?.trim() || undefined });
							}}
						/>
					)}
				</Stack.Screen>
				<Stack.Screen
					name="PasswordReset"
					options={{
						title: "비밀번호 재설정",
						headerBackTitle: "",
						headerBackButtonDisplayMode: "minimal",
						presentation: "modal",
					}}
				>
					{({ navigation, route }) => (
						<PasswordResetScreen
							initialEmail={route.params?.initialEmail}
							onSubmit={onResetPassword}
							onDone={() => {
								navigation.goBack();
							}}
						/>
					)}
				</Stack.Screen>
			</Stack.Navigator>
		</NavigationContainer>
	);
}
