import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { MaterialIcons } from "@expo/vector-icons";
import { createTabStyles } from "@/styles/App.styles";
import { FavoritesScreen } from "@/screens/Favorites/FavoritesScreen";
import { HomeScreen } from "@/screens/Home/HomeScreen";
import { SearchScreen } from "@/screens/Search/SearchScreen";
import { SettingsNavigator } from "@/screens/Settings/SettingsNavigator";
import { TAB_BAR_OPTIONS, TAB_VISUAL_CONFIG } from "@/navigation/tabConfig";
import { RootTabParamList } from "@/navigation/Navigation.types";
import { RootTabNavigatorProps } from "@/navigation/RootTabNavigator.types";
import { useThemedStyles } from "@/theme/useThemedStyles";
import { useAppAppearance } from "@/theme/AppearanceContext";

const Tab = createBottomTabNavigator<RootTabParamList>();

export function RootTabNavigator({
	favorites,
	onToggleFavorite,
	onUpdateFavoriteStatus,
	onRemoveFavorite,
	searchTerm,
	onChangeSearchTerm,
	onSubmitSearch,
	loading,
	error,
	result,
	examplesVisible,
	onToggleExamples,
	isCurrentFavorite,
	onPlayPronunciation,
	mode,
	onModeChange,
	themeMode,
	onThemeModeChange,
	fontScale,
	onFontScaleChange,
	recentSearches,
	onSelectRecentSearch,
	onClearRecentSearches,
	lastQuery,
	userName,
	onLogout,
	canLogout,
	isGuest,
	onRequestLogin,
	onRequestSignUp,
	onShowHelp,
	onPlayWordAudio,
	appVersion,
	profileDisplayName,
	profileUsername,
	onUpdateProfile,
	onUpdatePassword,
}: RootTabNavigatorProps) {
	const tabStyles = useThemedStyles(createTabStyles);
	const { theme } = useAppAppearance();
	return (
		<Tab.Navigator
			screenOptions={({ route }) => {
				const { icon, label } = TAB_VISUAL_CONFIG[route.name];
				return {
					headerShown: false,
					tabBarActiveTintColor: theme.tabIconActive,
					tabBarInactiveTintColor: theme.tabIconInactive,
					tabBarLabelStyle: tabStyles.tabLabel,
					tabBarStyle: tabStyles.tabBar,
					tabBarShowLabel: TAB_BAR_OPTIONS.showLabel,
					tabBarLabel: label,
					tabBarIcon: ({ color, size }) => <MaterialIcons name={icon} color={color} size={size} />,
				};
			}}
		>
			<Tab.Screen name="Home">
				{() => (
					<HomeScreen
						favorites={favorites}
						lastSearchedWord={lastQuery}
						mode={mode}
						onMoveToStatus={onUpdateFavoriteStatus}
						userName={userName}
						onPlayWordAudio={onPlayWordAudio}
					/>
				)}
			</Tab.Screen>
			<Tab.Screen name="Favorites">
				{() => (
					<FavoritesScreen
						favorites={favorites}
						onUpdateStatus={onUpdateFavoriteStatus}
						onRemoveFavorite={onRemoveFavorite}
						onPlayAudio={onPlayWordAudio}
					/>
				)}
			</Tab.Screen>
			<Tab.Screen name="Search">
				{() => (
					<SearchScreen
						searchTerm={searchTerm}
						onChangeSearchTerm={onChangeSearchTerm}
						onSubmit={onSubmitSearch}
						loading={loading}
						error={error}
						result={result}
						examplesVisible={examplesVisible}
						onToggleExamples={onToggleExamples}
						onToggleFavorite={(word) => {
							void onToggleFavorite(word);
						}}
						isCurrentFavorite={isCurrentFavorite}
						onPlayPronunciation={onPlayPronunciation}
						mode={mode}
						onModeChange={onModeChange}
						recentSearches={recentSearches}
						onSelectRecentSearch={onSelectRecentSearch}
						onClearRecentSearches={onClearRecentSearches}
					/>
				)}
			</Tab.Screen>
			<Tab.Screen name="Settings">
				{() => (
					<SettingsNavigator
						onLogout={onLogout}
						canLogout={canLogout}
						isGuest={isGuest}
						onRequestLogin={onRequestLogin}
						onRequestSignUp={onRequestSignUp}
						onShowHelp={onShowHelp}
						appVersion={appVersion}
						profileDisplayName={profileDisplayName}
						profileUsername={profileUsername}
						onUpdateProfile={onUpdateProfile}
						onUpdatePassword={onUpdatePassword}
						themeMode={themeMode}
						onThemeModeChange={onThemeModeChange}
						fontScale={fontScale}
						onFontScaleChange={onFontScaleChange}
					/>
				)}
			</Tab.Screen>
		</Tab.Navigator>
	);
}
