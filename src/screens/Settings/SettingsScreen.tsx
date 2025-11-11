import React, { useCallback, useMemo } from "react";
import { Alert, Linking, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { SettingsScreenProps } from "@/screens/Settings/SettingsScreen.types";
import { styles } from "@/screens/Settings/SettingsScreen.styles";
import { GuestActionCard } from "@/screens/Settings/components/GuestActionCard";
import { AuthenticatedActions } from "@/screens/Settings/components/AuthenticatedActions";
import { MISSING_USER_ERROR_MESSAGE } from "@/screens/App/AppScreen.constants";

const SUPPORT_EMAIL = "support@myvoc.app";
const CONTACT_SUBJECT = "MyVoc 1:1 문의";

type RowOptions = {
	onPress?: () => void;
	value?: string;
	isLast?: boolean;
};

export function SettingsScreen({
	onLogout,
	canLogout,
	isGuest,
	onRequestLogin,
	onRequestSignUp,
	onShowHelp,
	appVersion,
	profileDisplayName,
	profileUsername,
	onNavigateProfile,
}: SettingsScreenProps) {
	const handleLogoutPress = useCallback(() => {
		if (!canLogout) {
			return;
		}
		Alert.alert("로그아웃", "정말 로그아웃할까요?", [
			{ text: "취소", style: "cancel" },
			{
				text: "로그아웃",
				style: "destructive",
				onPress: onLogout,
			},
		]);
	}, [canLogout, onLogout]);

	const handleLoginPress = useCallback(() => {
		if (!isGuest) {
			return;
		}
		onRequestLogin();
	}, [isGuest, onRequestLogin]);

	const handleSignUpPress = useCallback(() => {
		if (!isGuest) {
			return;
		}
		onRequestSignUp();
	}, [isGuest, onRequestSignUp]);

	const handleNavigateProfile = useCallback(() => {
		if (!profileUsername) {
			Alert.alert("마이 페이지", MISSING_USER_ERROR_MESSAGE);
			return;
		}
		onNavigateProfile();
	}, [profileUsername, onNavigateProfile]);

	const handleContactSupport = useCallback(async () => {
		const subject = encodeURIComponent(CONTACT_SUBJECT);
		const body = encodeURIComponent(
			`계정: ${profileUsername ?? (isGuest ? "게스트" : "알 수 없음")}\n앱 버전: ${appVersion}\n\n문의 내용을 작성해주세요.\n`,
		);
		const mailtoUrl = `mailto:${SUPPORT_EMAIL}?subject=${subject}&body=${body}`;

		try {
			const canOpen = await Linking.canOpenURL(mailtoUrl);
			if (!canOpen) {
				throw new Error("Cannot open mail app");
			}
			await Linking.openURL(mailtoUrl);
		} catch (error) {
			Alert.alert("문의하기", `메일 앱을 열 수 없어요.\n${SUPPORT_EMAIL}로 직접 메일을 보내주세요.`);
		}
	}, [appVersion, isGuest, profileUsername]);

	const displayName = useMemo(() => {
		if (profileDisplayName && profileDisplayName.trim()) {
			return profileDisplayName;
		}
		return profileUsername ?? (isGuest ? "게스트 사용자" : "MyVoc 회원");
	}, [profileDisplayName, profileUsername, isGuest]);
	const profileSubtitle = useMemo(() => {
		if (isGuest) {
			return "게스트 모드";
		}
		return profileUsername ? `@${profileUsername}` : "계정 정보를 확인할 수 없어요.";
	}, [isGuest, profileUsername]);
	const initials = (displayName?.charAt(0) || "M").toUpperCase();

	const renderRow = (label: string, options: RowOptions = {}) => {
		const { onPress, value, isLast = false } = options;
		return (
			<TouchableOpacity
				key={label}
				activeOpacity={onPress ? 0.6 : 1}
				disabled={!onPress}
				onPress={onPress}
				style={[styles.row, !isLast && styles.rowBorder, !onPress && !value && styles.rowDisabled]}
			>
				<Text style={styles.rowLabel}>{label}</Text>
				{value ? <Text style={styles.rowValue}>{value}</Text> : <Text style={styles.rowChevron}>›</Text>}
			</TouchableOpacity>
		);
	};

	return (
		<SafeAreaView style={styles.safeArea}>
			<ScrollView contentContainerStyle={styles.scrollContent}>
				<View style={styles.profileCard}>
					<View style={styles.profileAvatar}>
						<Text style={styles.profileAvatarInitial}>{initials}</Text>
					</View>
					<View style={styles.profileInfo}>
						<Text style={styles.profileName}>{displayName}</Text>
						<Text style={styles.profileSubtitle}>{profileSubtitle}</Text>
					</View>
					{!isGuest ? (
						<TouchableOpacity style={styles.profileAction} onPress={handleNavigateProfile} activeOpacity={0.8}>
							<Text style={styles.profileActionText}>관리</Text>
						</TouchableOpacity>
					) : null}
				</View>

				<View style={styles.section}>
					<Text style={styles.sectionLabel}>일반</Text>
					<View style={styles.sectionCard}>
						{renderRow("도움말 다시 보기", { onPress: onShowHelp })}
						{renderRow("1:1 문의 보내기", { onPress: handleContactSupport })}
						{renderRow("앱 버전", { value: appVersion, isLast: true })}
					</View>
				</View>

				{isGuest ? (
					<View style={styles.section}>
						<Text style={styles.sectionLabel}>계정</Text>
						<GuestActionCard onSignUp={handleSignUpPress} onLogin={handleLoginPress} />
					</View>
				) : (
					<AuthenticatedActions
						canLogout={canLogout}
						onLogout={handleLogoutPress}
						onNavigateHome={onLogout}
						onNavigateProfile={handleNavigateProfile}
					/>
				)}
			</ScrollView>
		</SafeAreaView>
	);
}
