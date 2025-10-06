import React, { useCallback, useState } from "react";
import { ActivityIndicator, Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { styles } from "@/screens/Auth/LoginScreen.styles";
import { LoginScreenProps } from "@/screens/Auth/LoginScreen.types";

export function LoginScreen({ onLogin, onGuest, loading = false, errorMessage }: LoginScreenProps) {
	const [username, setUsername] = useState("");
	const [displayName, setDisplayName] = useState("");

	const trimmedUsername = username.trim();
	const trimmedDisplayName = displayName.trim();
	const isLoginDisabled = loading || trimmedUsername.length === 0;

	const handleLoginPress = useCallback(() => {
		if (isLoginDisabled) {
			return;
		}
		onLogin(trimmedUsername, trimmedDisplayName);
	}, [isLoginDisabled, onLogin, trimmedDisplayName, trimmedUsername]);

	const handleGuestPress = useCallback(() => {
		if (loading) {
			return;
		}
		onGuest();
	}, [loading, onGuest]);

	return (
		<SafeAreaView style={styles.safeArea}>
			<View style={styles.content}>
				<Text style={styles.title}>다시 만나서 반가워요!</Text>
				<Text style={styles.subtitle}>계정으로 로그인하거나, 게스트로 간단히 체험해보세요.</Text>

				{errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}

				<Text style={styles.inputLabel}>아이디</Text>
				<TextInput
					style={styles.textInput}
					value={username}
					onChangeText={setUsername}
					placeholder="아이디를 입력하세요"
					autoCapitalize="none"
					autoCorrect={false}
					editable={!loading}
					returnKeyType="next"
				/>

				<Text style={styles.inputLabel}>표시 이름 (선택)</Text>
				<TextInput
					style={styles.textInput}
					value={displayName}
					onChangeText={setDisplayName}
					placeholder="앱에서 표시할 닉네임을 입력하세요"
					autoCapitalize="none"
					autoCorrect={false}
					editable={!loading}
					returnKeyType="done"
				/>

				<Text style={styles.helperText}>로그인하면 단어 저장, 즐겨찾기 동기화 등 모든 기능을 사용할 수 있어요.</Text>

				<TouchableOpacity
					style={[styles.button, isLoginDisabled && styles.disabledButton]}
					onPress={handleLoginPress}
					disabled={isLoginDisabled}
					activeOpacity={0.9}
				>
					{loading ? (
						<View style={styles.buttonLoadingRow}>
							<ActivityIndicator size="small" color="#ffffff" />
							<Text style={styles.buttonLoadingText}>로그인 중...</Text>
						</View>
					) : (
						<Text style={styles.buttonText}>로그인</Text>
					)}
				</TouchableOpacity>

				<TouchableOpacity
					style={[styles.ghostButton, loading && styles.disabledButton]}
					onPress={handleGuestPress}
					disabled={loading}
					activeOpacity={0.9}
				>
					<Text style={styles.ghostButtonText}>게스트로 둘러보기</Text>
				</TouchableOpacity>

				<Text style={styles.footerNote}>게스트 모드에서는 단어 저장이 제한되고, 검색은 최대 10회까지만 가능합니다.</Text>
			</View>
		</SafeAreaView>
	);
}
