import Ionicons from "@expo/vector-icons/Ionicons";
import React from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";
import { SearchBarProps } from "@/screens/Search/components/SearchBar.types";
import { styles } from "@/screens/Search/components/SearchBar.styles";

export function SearchBar({ value, onChangeText, onSubmit }: SearchBarProps) {
	const handleClear = () => {
		if (value) {
			onChangeText("");
		}
	};

	return (
		<View style={styles.card}>
			<View style={styles.inputWrapper}>
				<TextInput
					value={value}
					onChangeText={onChangeText}
					placeholder="검색할 영어 단어를 입력하세요"
					returnKeyType="search"
					onSubmitEditing={onSubmit}
					style={styles.searchInput}
					autoCapitalize="none"
					autoCorrect={false}
					blurOnSubmit
				/>
			</View>
			<View style={styles.cardFooter}>
				<TouchableOpacity style={styles.clearButton} onPress={handleClear} disabled={!value}>
					<Ionicons name="close-circle-outline" size={18} color={value ? "#475569" : "#cbd5f5"} />
					<Text style={[styles.clearButtonText, !value && styles.clearButtonTextDisabled]}>지우기</Text>
				</TouchableOpacity>
				<TouchableOpacity style={styles.submitButton} onPress={onSubmit}>
					<Text style={styles.submitButtonText}>검색</Text>
					<Ionicons name="arrow-forward-circle" size={20} color="#ffffff" />
				</TouchableOpacity>
			</View>
		</View>
	);
}
