import React from "react";
import { Text, View } from "react-native";
import { BannerPlaceholderProps } from "@/app/components/BannerPlaceholder/BannerPlaceholder.types";
import { bannerPlaceholderStyles as styles } from "@/app/components/BannerPlaceholder/BannerPlaceholder.styles";

export function BannerPlaceholder(_: BannerPlaceholderProps) {
	return (
		<View style={styles.container}>
			<Text style={styles.label}>광고 배너 영역</Text>
		</View>
	);
}
