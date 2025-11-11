import React from "react";
import { fireEvent, render } from "@testing-library/react-native";

jest.mock("@expo/vector-icons/Ionicons", () => {
	const React = require("react");
	const { Text } = require("react-native");
	return (props: { name: string }) => <Text>{props.name}</Text>;
});

import { SearchScreen } from "@/screens/Search/SearchScreen";

const mockSearchBar = jest.fn(() => null);
const mockSearchResults = jest.fn(() => null);

jest.mock("@/screens/Search/components/SearchBar", () => ({
	SearchBar: (props: any) => mockSearchBar(props),
}));

jest.mock("@/screens/Search/components/SearchResults", () => ({
	SearchResults: (props: any) => mockSearchResults(props),
}));

describe("SearchScreen", () => {
	const baseProps = {
		searchTerm: "apple",
		onChangeSearchTerm: jest.fn(),
		onSubmit: jest.fn(),
		loading: false,
		error: null,
		result: null,
		examplesVisible: false,
		onToggleExamples: jest.fn(),
		onToggleFavorite: jest.fn(),
		isCurrentFavorite: false,
		onPlayPronunciation: jest.fn(),
		mode: "en-en" as const,
		onModeChange: jest.fn(),
	};

	beforeEach(() => {
		jest.clearAllMocks();
	});

	it("renders placeholder when no result and not loading", () => {
		const { getByText } = render(<SearchScreen {...baseProps} />);

		expect(getByText("검색 결과가 여기에 표시됩니다")).toBeTruthy();
		expect(mockSearchResults).not.toHaveBeenCalled();
	});

	it("renders SearchResults when result available", () => {
		const props = { ...baseProps, result: { word: "apple", phonetic: null, audioUrl: null, meanings: [] } };
		render(<SearchScreen {...props} />);

		expect(mockSearchResults).toHaveBeenCalledWith(
			expect.objectContaining({
				loading: false,
				error: null,
				result: props.result,
				isFavorite: props.isCurrentFavorite,
				onToggleFavorite: props.onToggleFavorite,
				onPlayPronunciation: props.onPlayPronunciation,
			}),
		);
	});

	it("calls onModeChange when tapping inactive mode button", () => {
		const props = { ...baseProps, mode: "en-ko" as const };
		const { getByText } = render(<SearchScreen {...props} />);

		fireEvent.press(getByText("영영사전"));
		expect(props.onModeChange).toHaveBeenCalledWith("en-en");
	});

	it("does not trigger disabled mode button", () => {
		const props = { ...baseProps, mode: "en-en" as const };
		const { getByText } = render(<SearchScreen {...props} />);

		fireEvent.press(getByText("영한사전 (준비중)"));
		expect(props.onModeChange).not.toHaveBeenCalledWith("en-ko");
	});
});
