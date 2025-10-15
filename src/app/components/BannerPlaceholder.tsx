import React from "react";
import { Text, View } from "react-native";
import { appStyles } from "@/app/styles/AppRoot.styles";

export function BannerPlaceholder() {
	return (
		<View style={appStyles.bannerPlaceholder}>
			<Text style={appStyles.bannerText}>광고 배너 영역</Text>
		</View>
	);
}
