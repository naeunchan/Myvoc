import React from "react";
import { Modal, Text, TextInput, TouchableOpacity, View, ActivityIndicator } from "react-native";
import { useThemedStyles } from "@/theme/useThemedStyles";
import { createLoginScreenStyles } from "@/screens/Auth/LoginScreen.styles";

type ForgotPasswordModalProps = {
	visible: boolean;
	email: string;
	errorMessage: string | null;
	loading: boolean;
	onChangeEmail: (value: string) => void;
	onClose: () => void;
	onSubmit: () => void;
};

export function ForgotPasswordModal({ visible, email, errorMessage, loading, onChangeEmail, onClose, onSubmit }: ForgotPasswordModalProps) {
	const styles = useThemedStyles(createLoginScreenStyles);

	return (
		<Modal animationType="fade" visible={visible} transparent onRequestClose={onClose}>
			<View style={styles.resetBackdrop}>
				<View style={styles.resetContainer}>
					<Text style={styles.resetTitle}>비밀번호 찾기</Text>
					<Text style={styles.resetDescription}>가입 시 사용한 이메일 주소를 입력하면 인증 메일을 보내드릴게요.</Text>
					<Text style={styles.resetHelperText}>이메일에 있는 안내를 따라 비밀번호를 재설정해주세요.</Text>
					<TextInput
						style={styles.textInput}
						placeholder="이메일 주소"
						value={email}
						autoCapitalize="none"
						autoCorrect={false}
						keyboardType="email-address"
						onChangeText={onChangeEmail}
						editable={!loading}
					/>
					{errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}
					<View style={styles.resetActions}>
						<TouchableOpacity style={[styles.resetButton, styles.resetButtonSecondary]} onPress={onClose} disabled={loading}>
							<Text style={styles.resetButtonSecondaryText}>취소</Text>
						</TouchableOpacity>
						<TouchableOpacity style={[styles.resetButton, styles.resetButtonPrimary]} onPress={onSubmit} disabled={loading}>
							{loading ? <ActivityIndicator color="#ffffff" /> : <Text style={styles.resetButtonPrimaryText}>인증 메일 보내기</Text>}
						</TouchableOpacity>
					</View>
				</View>
			</View>
		</Modal>
	);
}
