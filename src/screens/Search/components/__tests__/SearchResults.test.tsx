import React from "react";
import { render } from "@testing-library/react-native";
import { SearchResults } from "@/screens/Search/components/SearchResults";
import { WordResult } from "@/services/dictionary/types";

const mockWordResultCard = jest.fn();

jest.mock("@/services/dictionary/components/WordResultCard", () => {
	const React = require("react");
	const { Text } = require("react-native");
	return {
		WordResultCard: (props: any) => {
			mockWordResultCard(props);
			return <Text testID="word-result-card">{props.result.word}</Text>;
		},
	};
});

const baseResult: WordResult = {
	word: "apple",
	phonetic: "/ˈæp.əl/",
	audioUrl: "https://example.com/audio.mp3",
	meanings: [
		{
			partOfSpeech: "noun",
			definitions: [{ definition: "Fruit" }],
		},
	],
};

describe("SearchResults", () => {
	const defaultProps = {
		loading: false,
		error: null,
		result: baseResult,
		examplesVisible: false,
		onToggleExamples: jest.fn(),
		isFavorite: false,
		onToggleFavorite: jest.fn(),
		onPlayPronunciation: jest.fn(),
	};

	beforeEach(() => {
		jest.clearAllMocks();
	});

	it("renders loading indicator", () => {
		const { getByTestId } = render(<SearchResults {...defaultProps} loading result={null} />);
		expect(getByTestId("search-results-loading")).toBeTruthy();
	});

	it("renders error text", () => {
		const { getByTestId } = render(<SearchResults {...defaultProps} loading={false} error="에러" result={null} />);
		expect(getByTestId("search-results-error").children.join("")).toContain("에러");
	});

	it("renders null when no result", () => {
		const { toJSON } = render(<SearchResults {...defaultProps} loading={false} error={null} result={null} />);
		expect(toJSON()).toBeNull();
	});

	it("renders WordResultCard with provided props", () => {
		const props = { ...defaultProps, result: baseResult, isFavorite: true, examplesVisible: true };
		const { getByTestId } = render(<SearchResults {...props} />);

		expect(getByTestId("word-result-card").props.children).toBe("apple");
		expect(mockWordResultCard).toHaveBeenCalledWith(
			expect.objectContaining({
				result: baseResult,
				isFavorite: true,
				examplesVisible: true,
			}),
		);
	});
});
