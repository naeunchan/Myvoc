import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { SettingsNavigatorProps, SettingsStackParamList } from "@/screens/Settings/SettingsNavigator.types";
import { SettingsScreen } from "@/screens/Settings/SettingsScreen";
import { MyPageScreen } from "@/screens/Settings/MyPageScreen";
import { MyPageNicknameScreen } from "@/screens/Settings/MyPageNicknameScreen";
import { MyPagePasswordScreen } from "@/screens/Settings/MyPagePasswordScreen";
import { ThemeModeScreen } from "@/screens/Settings/ThemeModeScreen";
import { FontSizeScreen } from "@/screens/Settings/FontSizeScreen";

const Stack = createNativeStackNavigator<SettingsStackParamList>();

export function SettingsNavigator({
	onLogout,
	canLogout,
	isGuest,
	onRequestLogin,
	onRequestSignUp,
	onShowHelp,
	appVersion,
	profileDisplayName,
	profileUsername,
	onUpdateProfile,
	onUpdatePassword,
	themeMode,
	onThemeModeChange,
	fontScale,
	onFontScaleChange,
}: SettingsNavigatorProps) {
	return (
		<Stack.Navigator>
			<Stack.Screen name="SettingsHome" options={{ headerShown: false, title: "설정" }}>
				{({ navigation }) => (
					<SettingsScreen
						onLogout={onLogout}
						canLogout={canLogout}
						isGuest={isGuest}
						onRequestLogin={onRequestLogin}
						onRequestSignUp={onRequestSignUp}
						onShowHelp={onShowHelp}
						appVersion={appVersion}
						profileDisplayName={profileDisplayName}
						profileUsername={profileUsername}
						onNavigateProfile={() => {
							navigation.navigate("MyPage");
						}}
						themeMode={themeMode}
						fontScale={fontScale}
						onNavigateThemeSettings={() => {
							navigation.navigate("ThemeModeSettings");
						}}
						onNavigateFontSettings={() => {
							navigation.navigate("FontSizeSettings");
						}}
					/>
				)}
			</Stack.Screen>
			<Stack.Screen
				name="MyPage"
				options={{
					title: "마이 페이지",
					headerBackTitle: "",
					headerBackButtonDisplayMode: "minimal",
				}}
			>
				{({ navigation }) => (
					<MyPageScreen
						username={profileUsername ?? ""}
						displayName={profileDisplayName}
						onNavigateNickname={() => {
							navigation.navigate("MyPageNickname");
						}}
						onNavigatePassword={() => {
							navigation.navigate("MyPagePassword");
						}}
					/>
				)}
			</Stack.Screen>
			<Stack.Screen
				name="MyPageNickname"
				options={{
					title: "닉네임 설정",
					headerBackButtonDisplayMode: "minimal",
				}}
			>
				{({ navigation }) => (
					<MyPageNicknameScreen
						username={profileUsername ?? ""}
						displayName={profileDisplayName}
						onUpdateProfile={onUpdateProfile}
						onGoBack={() => {
							navigation.goBack();
						}}
					/>
				)}
			</Stack.Screen>
			<Stack.Screen
				name="MyPagePassword"
				options={{
					title: "비밀번호 변경",
					headerBackButtonDisplayMode: "minimal",
				}}
			>
				{({ navigation }) => (
					<MyPagePasswordScreen
						username={profileUsername ?? ""}
						onUpdatePassword={onUpdatePassword}
						onGoBack={() => {
							navigation.goBack();
						}}
					/>
				)}
			</Stack.Screen>
			<Stack.Screen
				name="ThemeModeSettings"
				options={{
					title: "화면 모드",
					headerBackButtonDisplayMode: "minimal",
				}}
			>
				{() => <ThemeModeScreen themeMode={themeMode} onChangeThemeMode={onThemeModeChange} />}
			</Stack.Screen>
			<Stack.Screen
				name="FontSizeSettings"
				options={{
					title: "글자 크기",
					headerBackButtonDisplayMode: "minimal",
				}}
			>
				{() => <FontSizeScreen fontScale={fontScale} onChangeFontScale={onFontScaleChange} />}
			</Stack.Screen>
		</Stack.Navigator>
	);
}
