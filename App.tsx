import React, { useCallback, useState } from "react";
import { AppScreen } from "@/screens/App/AppScreen";
import { AppErrorBoundary } from "@/components/AppErrorBoundary";
import { initializeLogging } from "@/logging/logger";

initializeLogging();

export default function App() {
	const [appKey, setAppKey] = useState(0);
	const handleRestart = useCallback(() => {
		setAppKey((previous) => previous + 1);
	}, []);

	return (
		<AppErrorBoundary enabled={!__DEV__} onRestart={handleRestart}>
			<AppScreen key={appKey} />
		</AppErrorBoundary>
	);
}
