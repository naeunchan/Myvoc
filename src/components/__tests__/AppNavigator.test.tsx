import React from "react";
import { render } from "@testing-library/react-native";
import { AppNavigator } from "@/components/AppNavigator/AppNavigator";
import { RootTabNavigatorProps } from "@/navigation/RootTabNavigator.types";

const mockRootTabNavigator = jest.fn();

jest.mock("@react-navigation/native", () => {
	const React = require("react");
	return {
		NavigationContainer: ({ children }: { children: React.ReactNode }) => <>{children}</>,
	};
});

jest.mock("@/navigation/RootTabNavigator", () => {
	const React = require("react");
	const { Text } = require("react-native");
	return {
		RootTabNavigator: (props: any) => {
			mockRootTabNavigator(props);
			return <Text testID="root-tab-navigator">RootTab</Text>;
		},
	};
});

const createProps = (): RootTabNavigatorProps => {
	const noop = jest.fn();
	const asyncNoop = jest.fn(() => Promise.resolve());
	return {
		favorites: [],
		onToggleFavorite: noop,
		onUpdateFavoriteStatus: jest.fn(),
		onRemoveFavorite: jest.fn(),
		searchTerm: "",
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
		lastQuery: null,
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

describe("AppNavigator", () => {
	it("renders RootTabNavigator inside NavigationContainer", () => {
		const props = createProps();
		const { getByTestId } = render(<AppNavigator {...props} />);

		expect(getByTestId("root-tab-navigator")).toBeTruthy();
		expect(mockRootTabNavigator).toHaveBeenCalledWith(expect.objectContaining({ favorites: [] }));
	});
});
