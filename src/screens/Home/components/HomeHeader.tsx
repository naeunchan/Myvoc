import React from "react";
import { Text, View } from "react-native";
import { HOME_HEADER_TEXT } from "@/screens/Home/constants";
import { styles } from "@/screens/Home/styles/HomeHeader.styles";
import { HomeHeaderProps } from "@/screens/Home/types/HomeHeader.types";

export function HomeHeader({ userName }: HomeHeaderProps) {
	const displayName = userName?.trim() ? `${userName}님` : HOME_HEADER_TEXT.defaultDisplayName;

	return (
		<View style={styles.container}>
			<Text style={styles.badge}>{HOME_HEADER_TEXT.badgeLabel}</Text>
			<Text style={styles.title}>
				{displayName}
				{"\n"}
				{HOME_HEADER_TEXT.titleSuffix}
			</Text>
			<Text style={styles.subtitle}>{HOME_HEADER_TEXT.subtitle}</Text>
		</View>
	);
}
