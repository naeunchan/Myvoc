import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { RootTabNavigator } from "@/navigation/RootTabNavigator";
import { AppNavigatorProps } from "@/app/components/AppNavigator/AppNavigator.types";

export function AppNavigator(props: AppNavigatorProps) {
	return (
		<NavigationContainer>
			<RootTabNavigator {...props} />
		</NavigationContainer>
	);
}
