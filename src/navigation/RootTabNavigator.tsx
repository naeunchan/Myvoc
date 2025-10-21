import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { MaterialIcons } from "@expo/vector-icons";
import { tabStyles } from "@/app/styles/App.styles";
import { FavoritesScreen } from "@/screens/Favorites/FavoritesScreen";
import { HomeScreen } from "@/screens/Home/HomeScreen";
import { SearchScreen } from "@/screens/Search/SearchScreen";
import { SettingsScreen } from "@/screens/Settings/SettingsScreen";
import { TAB_BAR_COLORS, TAB_BAR_OPTIONS, TAB_VISUAL_CONFIG } from "@/navigation/tabConfig";
import { RootTabParamList } from "@/navigation/Navigation.types";
import { RootTabNavigatorProps } from "@/navigation/RootTabNavigator.types";

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
	isCurrentFavorite,
	onPlayPronunciation,
	mode,
	onModeChange,
	lastQuery,
	userName,
	onLogout,
	canLogout,
	isGuest,
	onRequestLogin,
	onRequestSignUp,
	onShowHelp,
	onPlayWordAudio,
}: RootTabNavigatorProps) {
	return (
		<Tab.Navigator
			screenOptions={({ route }) => {
				const { icon, label } = TAB_VISUAL_CONFIG[route.name];
				return {
					headerShown: false,
					tabBarActiveTintColor: TAB_BAR_COLORS.active,
					tabBarInactiveTintColor: TAB_BAR_COLORS.inactive,
					tabBarLabelStyle: tabStyles.tabLabel,
					tabBarStyle: tabStyles.tabBar,
					tabBarShowLabel: TAB_BAR_OPTIONS.showLabel,
					tabBarLabel: label,
					tabBarIcon: ({ color, size }) => (
						<MaterialIcons name={icon} color={color} size={size} />
					),
				};
			}}
		>
		<Tab.Screen
			name="Home"
		>
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
	<Tab.Screen
		name="Favorites"
	>
		{() => (
			<FavoritesScreen
				favorites={favorites}
				onUpdateStatus={onUpdateFavoriteStatus}
				onRemoveFavorite={onRemoveFavorite}
				onPlayAudio={onPlayWordAudio}
			/>
		)}
	</Tab.Screen>
			<Tab.Screen
				name="Search"
			>
				{() => (
					<SearchScreen
						searchTerm={searchTerm}
						onChangeSearchTerm={onChangeSearchTerm}
						onSubmit={onSubmitSearch}
						loading={loading}
						error={error}
						result={result}
						onToggleFavorite={(word) => {
							void onToggleFavorite(word);
						}}
						isCurrentFavorite={isCurrentFavorite}
						onPlayPronunciation={onPlayPronunciation}
						mode={mode}
						onModeChange={onModeChange}
					/>
				)}
			</Tab.Screen>
			<Tab.Screen
				name="Settings"
			>
				{() => (
					<SettingsScreen
						onLogout={onLogout}
						canLogout={canLogout}
						isGuest={isGuest}
						onRequestLogin={onRequestLogin}
						onRequestSignUp={onRequestSignUp}
						onShowHelp={onShowHelp}
					/>
				)}
			</Tab.Screen>
		</Tab.Navigator>
	);
}
