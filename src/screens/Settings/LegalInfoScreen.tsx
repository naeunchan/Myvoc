import React, { useCallback } from "react";
import { Alert, Linking, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Constants from "expo-constants";
import { LEGAL_URLS } from "@/shared/constants/legal";
import { useThemedStyles } from "@/theme/useThemedStyles";
import { createLegalInfoScreenStyles } from "@/screens/Settings/LegalInfoScreen.styles";

type LegalInfoScreenProps = {
	appVersion: string;
};

export function LegalInfoScreen({ appVersion }: LegalInfoScreenProps) {
	const styles = useThemedStyles(createLegalInfoScreenStyles);
	const appName = Constants.expoConfig?.name ?? "MyVoc";

	const openExternal = useCallback(async (target: string) => {
		try {
			const supported = await Linking.canOpenURL(target);
			if (!supported) {
				throw new Error("링크를 열 수 없어요.");
			}
			await Linking.openURL(target);
		} catch (error) {
			const message = error instanceof Error ? error.message : "링크를 열 수 없어요.";
			Alert.alert("연결 오류", message);
		}
	}, []);

	return (
		<SafeAreaView style={styles.safeArea}>
			<ScrollView contentContainerStyle={styles.scrollContent}>
				<View style={styles.headerCard}>
					<Text style={styles.appName}>{appName}</Text>
					<Text style={styles.appVersion}>버전 {appVersion}</Text>
					<Text style={styles.description}>
						MyVoc는 모든 데이터를 기기 내 SQLite에 저장하며, 계정 삭제를 요청하면 서버와 기기에서 즉시 삭제돼요. 자세한 내용은 아래
						문서를 확인해주세요.
					</Text>
				</View>

				<View style={styles.linkCard}>
					<Text style={styles.linkTitle}>개인정보 처리방침</Text>
					<Text style={styles.linkSubtitle}>서비스 이용 시 수집·이용되는 개인정보 처리 방식에 대해 안내해드려요.</Text>
					<TouchableOpacity
						style={styles.linkButton}
						onPress={() => {
							void openExternal(LEGAL_URLS.privacyPolicy);
						}}
					>
						<Text style={styles.linkButtonLabel}>문서 열기</Text>
					</TouchableOpacity>
				</View>

				<View style={styles.linkCard}>
					<Text style={styles.linkTitle}>서비스 이용약관</Text>
					<Text style={styles.linkSubtitle}>MyVoc 이용 시 동의해야 하는 약관 내용을 확인할 수 있어요.</Text>
					<TouchableOpacity
						style={styles.linkButton}
						onPress={() => {
							void openExternal(LEGAL_URLS.termsOfService);
						}}
					>
						<Text style={styles.linkButtonLabel}>문서 열기</Text>
					</TouchableOpacity>
				</View>
			</ScrollView>
		</SafeAreaView>
	);
}
