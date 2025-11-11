import React from "react";
import { render } from "@testing-library/react-native";
import { SummaryCard } from "@/screens/Home/components/SummaryCard";
import { SUMMARY_CARD_TEXT } from "@/screens/Home/constants";

describe("SummaryCard", () => {
	const baseProps = {
		userName: "Mia",
		mode: "en-en" as const,
		counts: { toMemorize: 3, review: 2, mastered: 1 },
		lastSearchedWord: "hello",
	};

	it("renders stats and last search information", () => {
		const { getByText } = render(<SummaryCard {...baseProps} />);

		expect(getByText("Mia님의 진행상황")).toBeTruthy();
		expect(getByText("전체 단어")).toBeTruthy();
		expect(getByText("6")).toBeTruthy(); // total
		expect(getByText(baseProps.lastSearchedWord!)).toBeTruthy();
	});

	it("shows fallback texts when user name or last search missing", () => {
		const { getByText } = render(
			<SummaryCard {...baseProps} userName="" lastSearchedWord={null} />,
		);

		expect(getByText(SUMMARY_CARD_TEXT.defaultGreeting)).toBeTruthy();
		expect(getByText(SUMMARY_CARD_TEXT.lastSearchFallback)).toBeTruthy();
	});
});
