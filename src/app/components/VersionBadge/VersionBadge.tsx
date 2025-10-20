import React from "react";
import { Text, View } from "react-native";
import { VersionBadgeProps } from "@/app/components/VersionBadge/VersionBadge.types";
import { versionBadgeStyles as styles } from "@/app/components/VersionBadge/VersionBadge.styles";

export function VersionBadge({ label }: VersionBadgeProps) {
	return (
		<View style={styles.container}>
			<Text style={styles.label}>버전 {label}</Text>
		</View>
	);
}
