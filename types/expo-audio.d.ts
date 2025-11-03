declare module "expo-audio" {
	export namespace Audio {
		type PlaybackStatusSuccess = {
			isLoaded: true;
			didJustFinish: boolean;
		};

		type PlaybackStatusError = {
			isLoaded: false;
			error?: string;
		};

		type PlaybackStatus = PlaybackStatusSuccess | PlaybackStatusError;

		type PlaybackStatusUpdate = (status: PlaybackStatus) => void;

		class SoundObject {
			setOnPlaybackStatusUpdate(callback: PlaybackStatusUpdate | null): void;
			playAsync(): Promise<void>;
			unloadAsync(): Promise<void>;
		}

		namespace Sound {
			function createAsync(
				source: { uri: string },
				initialStatus?: Record<string, unknown>,
			): Promise<{ sound: SoundObject }>;
		}
	}
}
