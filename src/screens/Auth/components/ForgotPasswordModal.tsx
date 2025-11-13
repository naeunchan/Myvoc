import React from "react";
import { Modal, Text, TextInput, TouchableOpacity, View, ActivityIndicator } from "react-native";
import { useThemedStyles } from "@/theme/useThemedStyles";
import { createLoginScreenStyles } from "@/screens/Auth/LoginScreen.styles";

type ForgotPasswordModalProps = {
	visible: boolean;
	username: string;
	newPassword: string;
	errorMessage: string | null;
	loading: boolean;
	onChangeUsername: (value: string) => void;
	onChangePassword: (value: string) => void;
	onClose: () => void;
	onSubmit: () => void;
};

export function ForgotPasswordModal({
	visible,
	username,
	newPassword,
	errorMessage,
	loading,
	onChangeUsername,
	onChangePassword,
	onClose,
	onSubmit,
}: ForgotPasswordModalProps) {
	const styles = useThemedStyles(createLoginScreenStyles);

	return (
		<Modal animationType="fade" visible={visible} transparent onRequestClose={onClose}>
			<View style={styles.resetBackdrop}>
				<View style={styles.resetContainer}>
					<Text style={styles.resetTitle}>비밀번호 재설정</Text>
					<Text style={styles.resetDescription}>가입한 아이디와 사용할 새 비밀번호를 입력해주세요.</Text>
					<TextInput
						style={styles.textInput}
						placeholder="아이디"
						value={username}
						autoCapitalize="none"
						autoCorrect={false}
						onChangeText={onChangeUsername}
						editable={!loading}
					/>
					<TextInput
						style={styles.textInput}
						placeholder="새 비밀번호"
						value={newPassword}
						autoCapitalize="none"
						secureTextEntry
						onChangeText={onChangePassword}
						editable={!loading}
					/>
					{errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}
					<View style={styles.resetActions}>
						<TouchableOpacity style={[styles.resetButton, styles.resetButtonSecondary]} onPress={onClose} disabled={loading}>
							<Text style={styles.resetButtonSecondaryText}>취소</Text>
						</TouchableOpacity>
						<TouchableOpacity style={[styles.resetButton, styles.resetButtonPrimary]} onPress={onSubmit} disabled={loading}>
							{loading ? <ActivityIndicator color="#ffffff" /> : <Text style={styles.resetButtonPrimaryText}>재설정</Text>}
						</TouchableOpacity>
					</View>
				</View>
			</View>
		</Modal>
	);
}
