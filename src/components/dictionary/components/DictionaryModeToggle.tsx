import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { DictionaryMode, DictionaryModeToggleProps } from "@/components/dictionary/types/DictionaryMode";
import { styles } from "@/components/dictionary/styles/DictionaryModeToggle.styles";

const MODE_OPTIONS: Array<{ label: string; value: DictionaryMode }> = [
	{ label: "영영사전", value: "en-en" },
	{ label: "영한사전", value: "en-ko" },
];

export function DictionaryModeToggle({ mode, onChange }: DictionaryModeToggleProps) {
	return (
		<View style={styles.container}>
			{MODE_OPTIONS.map((option) => {
				const isActive = option.value === mode;
				return (
					<TouchableOpacity
						key={option.value}
						style={[styles.button, isActive && styles.activeButton]}
						onPress={() => {
							if (!isActive) {
								onChange(option.value);
							}
						}}
						activeOpacity={0.9}
					>
						<Text style={[styles.label, isActive && styles.activeLabel]}>{option.label}</Text>
					</TouchableOpacity>
				);
			})}
		</View>
	);
}
