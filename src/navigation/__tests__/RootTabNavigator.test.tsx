import React from "react";
import { render } from "@testing-library/react-native";
import { RootTabNavigator } from "@/navigation/RootTabNavigator";
import { RootTabNavigatorProps } from "@/navigation/RootTabNavigator.types";

const mockHomeScreen = jest.fn(() => null);
const mockFavoritesScreen = jest.fn(() => null);
const mockSearchScreen = jest.fn(() => null);
const mockSettingsNavigator = jest.fn(() => null);

jest.mock("@expo/vector-icons", () => ({
	MaterialIcons: () => null,
}));

jest.mock("@/screens/Home/HomeScreen", () => ({
	HomeScreen: (props: any) => mockHomeScreen(props),
}));

jest.mock("@/screens/Favorites/FavoritesScreen", () => ({
	FavoritesScreen: (props: any) => mockFavoritesScreen(props),
}));

jest.mock("@/screens/Search/SearchScreen", () => ({
	SearchScreen: (props: any) => mockSearchScreen(props),
}));

jest.mock("@/screens/Settings/SettingsNavigator", () => ({
	SettingsNavigator: (props: any) => mockSettingsNavigator(props),
}));

jest.mock("@react-navigation/bottom-tabs", () => {
	const React = require("react");
	return {
		createBottomTabNavigator: () => {
			const Navigator = ({ children }: { children: React.ReactNode }) => <>{children}</>;
			const Screen = ({ children }: { children: React.ReactNode | ((props: any) => React.ReactNode) }) => (
				<>{typeof children === "function" ? children({}) : children}</>
			);
			return { Navigator, Screen };
		},
	};
});

const buildProps = (): RootTabNavigatorProps => {
	const noop = jest.fn();
	const asyncNoop = jest.fn(() => Promise.resolve());

	return {
		favorites: [],
		onToggleFavorite: noop,
		onUpdateFavoriteStatus: jest.fn(),
		onRemoveFavorite: jest.fn(),
		searchTerm: "apple",
		onChangeSearchTerm: noop,
		onSubmitSearch: noop,
		loading: false,
		error: null,
		result: null,
		examplesVisible: false,
		onToggleExamples: noop,
		isCurrentFavorite: false,
		onPlayPronunciation: noop,
		mode: "en-en",
		onModeChange: noop,
		recentSearches: [],
		onSelectRecentSearch: noop,
		onClearRecentSearches: noop,
		lastQuery: "apple",
		userName: "Alex",
		onLogout: noop,
		canLogout: true,
		isGuest: false,
		onRequestLogin: noop,
		onRequestSignUp: noop,
		onShowHelp: noop,
		onPlayWordAudio: noop,
		appVersion: "1.0.0",
		profileDisplayName: "Alex",
		profileUsername: "alex",
		onUpdateProfile: asyncNoop,
		onUpdatePassword: asyncNoop,
	};
};

describe("RootTabNavigator", () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	it("renders Home and Search screens with expected props", () => {
		const props = buildProps();
		render(<RootTabNavigator {...props} />);

		expect(mockHomeScreen).toHaveBeenCalledWith(
			expect.objectContaining({
				favorites: props.favorites,
				lastSearchedWord: props.lastQuery,
				mode: props.mode,
				userName: props.userName,
				onPlayWordAudio: props.onPlayWordAudio,
			}),
		);

		expect(mockSearchScreen).toHaveBeenCalledWith(
			expect.objectContaining({
				searchTerm: props.searchTerm,
				onChangeSearchTerm: props.onChangeSearchTerm,
				onSubmit: props.onSubmitSearch,
				loading: props.loading,
				error: props.error,
				result: props.result,
				examplesVisible: props.examplesVisible,
				onToggleExamples: props.onToggleExamples,
				mode: props.mode,
				recentSearches: props.recentSearches,
				onSelectRecentSearch: props.onSelectRecentSearch,
				onClearRecentSearches: props.onClearRecentSearches,
			}),
		);
	});

	it("passes favorites props to FavoritesScreen and SettingsNavigator", () => {
		const props = buildProps();
		render(<RootTabNavigator {...props} />);

		expect(mockFavoritesScreen).toHaveBeenCalledWith(
			expect.objectContaining({
				favorites: props.favorites,
				onUpdateStatus: props.onUpdateFavoriteStatus,
				onRemoveFavorite: props.onRemoveFavorite,
				onPlayAudio: props.onPlayWordAudio,
			}),
		);

		expect(mockSettingsNavigator).toHaveBeenCalledWith(
			expect.objectContaining({
				onLogout: props.onLogout,
				canLogout: props.canLogout,
				isGuest: props.isGuest,
				onRequestLogin: props.onRequestLogin,
				onRequestSignUp: props.onRequestSignUp,
				onShowHelp: props.onShowHelp,
				appVersion: props.appVersion,
				profileDisplayName: props.profileDisplayName,
				profileUsername: props.profileUsername,
				onUpdateProfile: props.onUpdateProfile,
				onUpdatePassword: props.onUpdatePassword,
			}),
		);
	});
});
