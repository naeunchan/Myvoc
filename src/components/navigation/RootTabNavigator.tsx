import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { MaterialIcons } from "@expo/vector-icons";
import { tabStyles } from "@/app/styles/App.styles";
import { FavoritesScreen } from "@/components/favorites/screens/FavoritesScreen";
import { HomeScreen } from "@/components/home/screens/HomeScreen";
import { SearchScreen } from "@/components/search/screens/SearchScreen";
import { SettingsScreen } from "@/components/settings/screens/SettingsScreen";
import { TAB_BAR_COLORS, TAB_BAR_OPTIONS, TAB_VISUAL_CONFIG } from "@/components/navigation/constants/tabConfig";
import { RootTabParamList } from "@/components/navigation/types/Navigation";
import { RootTabNavigatorProps } from "@/components/navigation/types/RootTabNavigator";

const Tab = createBottomTabNavigator<RootTabParamList>();

export function RootTabNavigator({
	favorites,
	onToggleFavorite,
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
				{() => <HomeScreen favoritesCount={favorites.length} lastSearchedWord={lastQuery} mode={mode} />}
			</Tab.Screen>
			<Tab.Screen
				name="Favorites"
			>
				{() => <FavoritesScreen favorites={favorites} onRemove={onToggleFavorite} />}
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
						onToggleFavorite={onToggleFavorite}
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
				{() => <SettingsScreen mode={mode} onModeChange={onModeChange} />}
			</Tab.Screen>
		</Tab.Navigator>
	);
}
