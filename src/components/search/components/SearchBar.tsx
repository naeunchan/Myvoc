import React from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";
import { SearchBarProps } from "@/components/search/types/SearchBar";
import { styles } from "@/components/search/styles/SearchBar.styles";

export function SearchBar({ value, onChangeText, onSubmit }: SearchBarProps) {
	return (
		<View style={styles.searchBox}>
			<TextInput
				value={value}
				onChangeText={onChangeText}
				placeholder="영어 단어를 입력하세요"
				returnKeyType="search"
				onSubmitEditing={onSubmit}
				style={styles.searchInput}
				autoCapitalize="none"
				autoCorrect={false}
			/>
			<TouchableOpacity style={styles.searchButton} onPress={onSubmit}>
				<Text style={styles.searchButtonText}>검색</Text>
			</TouchableOpacity>
		</View>
	);
}
