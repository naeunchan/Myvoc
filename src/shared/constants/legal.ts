const FALLBACK_PRIVACY_URL = "https://example.com/privacy";
const FALLBACK_TERMS_URL = "https://example.com/terms";

function resolveEnv(key: string | undefined, fallback: string) {
	if (!key) {
		return fallback;
	}
	return key;
}

export const LEGAL_URLS = {
	privacyPolicy: resolveEnv(process.env.EXPO_PUBLIC_PRIVACY_POLICY_URL, FALLBACK_PRIVACY_URL),
	termsOfService: resolveEnv(process.env.EXPO_PUBLIC_TERMS_URL, FALLBACK_TERMS_URL),
} as const;
