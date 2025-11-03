import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { DictionaryMode, DictionaryModeToggleProps } from "@/features/dictionary/types/DictionaryMode";
import { styles } from "@/features/dictionary/styles/DictionaryModeToggle.styles";

const MODE_OPTIONS: Array<{ label: string; value: DictionaryMode }> = [
	{ label: "영영사전", value: "en-en" },
	{ label: "영한사전", value: "en-ko" },
];

const DISABLED_MODES = new Set<DictionaryMode>(["en-ko"]);

export function DictionaryModeToggle({ mode, onChange }: DictionaryModeToggleProps) {
	return (
		<View style={styles.container}>
			{MODE_OPTIONS.map((option) => {
				const isActive = option.value === mode;
				const isDisabled = DISABLED_MODES.has(option.value);
				return (
					<TouchableOpacity
						key={option.value}
						style={[styles.button, isActive && styles.activeButton, isDisabled && styles.disabledButton]}
						disabled={isDisabled}
						onPress={() => {
							if (!isActive && !isDisabled) {
								onChange(option.value);
							}
						}}
						activeOpacity={0.9}
					>
						<Text style={[styles.label, isActive && styles.activeLabel, isDisabled && styles.disabledLabel]}>
							{isDisabled ? `${option.label} (준비중)` : option.label}
						</Text>
					</TouchableOpacity>
				);
			})}
		</View>
	);
}
