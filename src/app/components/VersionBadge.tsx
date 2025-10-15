import React from "react";
import { Text, View } from "react-native";
import { appStyles } from "@/app/styles/AppRoot.styles";

type VersionBadgeProps = {
	label: string;
};

export function VersionBadge({ label }: VersionBadgeProps) {
	return (
		<View style={appStyles.versionBadge}>
			<Text style={appStyles.versionText}>버전 {label}</Text>
		</View>
	);
}
