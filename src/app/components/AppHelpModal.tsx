import React from "react";
import { Modal, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

type AppHelpModalProps = {
	visible: boolean;
	onDismiss: () => void;
};

export function AppHelpModal({ visible, onDismiss }: AppHelpModalProps) {
	return (
		<Modal transparent animationType="fade" visible={visible} onRequestClose={onDismiss}>
			<View style={styles.backdrop}>
				<View style={styles.container}>
					<ScrollView
						style={styles.scrollView}
						contentContainerStyle={styles.scrollContent}
						showsVerticalScrollIndicator={false}
					>
						<Text style={styles.title}>MyVoc 사용 안내</Text>
						<Text style={styles.description}>
							MyVoc은 영어 단어를 검색하고 저장하며 반복 학습할 수 있도록 도와주는 단어 학습 도구예요. 아래 순서를 참고해 첫 학습을
							시작해보세요.
						</Text>
						<View style={styles.section}>
							<Text style={styles.sectionTitle}>1. 단어 검색하기</Text>
							<Text style={styles.sectionBody}>
								하단의 `Search` 탭에서 단어를 입력하고 검색 버튼을 누르면 발음, 의미, 예문을 바로 확인할 수 있어요. 필요한 사전
								모드(영영/한영)를 선택할 수도 있어요.
							</Text>
						</View>
						<View style={styles.section}>
							<Text style={styles.sectionTitle}>2. 즐겨찾기와 암기 상태</Text>
							<Text style={styles.sectionBody}>
								검색 결과에서 `즐겨찾기` 버튼을 누르면 단어가 내 단어장에 저장돼요. 단어의 암기 상태(외울 단어/복습/완료)를
								바꿔가며 학습 진척도를 관리해보세요.
							</Text>
						</View>
						<View style={styles.section}>
							<Text style={styles.sectionTitle}>3. 홈 탭으로 학습 시작</Text>
							<Text style={styles.sectionBody}>
								`Home` 탭에서는 오늘 외워야 할 단어 수와 최근 검색한 단어를 한눈에 확인하고, 외울 단어 목록에서 바로 학습을
								시작할 수 있어요.
							</Text>
						</View>
						<View style={styles.section}>
							<Text style={styles.sectionTitle}>4. 설정에서 계정 관리</Text>
							<Text style={styles.sectionBody}>
								`Settings` 탭에서 로그인, 회원가입, 게스트 모드 전환을 할 수 있어요. 로그인하면 여러 기기에서도 즐겨찾기 목록이
								유지돼요.
							</Text>
						</View>
					</ScrollView>
					<Pressable onPress={onDismiss} style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}>
						<Text style={styles.buttonText}>시작하기</Text>
					</Pressable>
				</View>
			</View>
		</Modal>
	);
}

const styles = StyleSheet.create({
	backdrop: {
		flex: 1,
		backgroundColor: "rgba(17, 24, 39, 0.6)",
		alignItems: "center",
		justifyContent: "center",
		padding: 24,
	},
	container: {
		width: "100%",
		maxWidth: 440,
		backgroundColor: "#ffffff",
		borderRadius: 20,
		paddingHorizontal: 24,
		paddingTop: 24,
		paddingBottom: 16,
		shadowColor: "#000000",
		shadowOpacity: 0.2,
		shadowRadius: 24,
		shadowOffset: { width: 0, height: 8 },
		elevation: 8,
	},
	scrollView: {
		maxHeight: 420,
	},
	scrollContent: {
		paddingBottom: 8,
	},
	title: {
		fontSize: 20,
		fontWeight: "700",
		color: "#111827",
		marginBottom: 12,
	},
	description: {
		fontSize: 14,
		color: "#374151",
		lineHeight: 20,
		marginBottom: 20,
	},
	section: {
		marginBottom: 16,
	},
	sectionTitle: {
		fontSize: 16,
		fontWeight: "600",
		color: "#111827",
		marginBottom: 6,
	},
	sectionBody: {
		fontSize: 14,
		color: "#4b5563",
		lineHeight: 20,
	},
	button: {
		marginTop: 12,
		backgroundColor: "#2563eb",
		borderRadius: 12,
		paddingVertical: 14,
		alignItems: "center",
	},
	buttonPressed: {
		opacity: 0.85,
	},
	buttonText: {
		fontSize: 15,
		fontWeight: "600",
		color: "#ffffff",
	},
});
