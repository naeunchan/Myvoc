import { Audio } from "expo-audio";

type PlaybackStatus =
	| {
			isLoaded: true;
			didJustFinish: boolean;
	  }
	| {
			isLoaded: false;
			error?: string;
	  };

export async function playRemoteAudio(uri: string) {
	const soundObject = await Audio.Sound.createAsync({ uri });
	const sound = soundObject?.sound;
	if (!sound) {
		throw new Error("오디오를 재생할 수 없어요.");
	}
	let resolved = false;

	try {
		await new Promise<void>((resolve, reject) => {
			sound.setOnPlaybackStatusUpdate((status: PlaybackStatus) => {
				if (!status.isLoaded) {
					if ("error" in status && status.error) {
						if (!resolved) {
							resolved = true;
							reject(new Error(status.error));
						}
					}
					return;
				}

				if (status.didJustFinish) {
					if (!resolved) {
						resolved = true;
						void sound.unloadAsync().finally(resolve);
					}
				}
			});

			sound.playAsync().catch((error: unknown) => {
				if (!resolved) {
					resolved = true;
					void sound.unloadAsync().finally(() => {
						reject(error instanceof Error ? error : new Error("Failed to play audio"));
					});
				}
			});
		});
	} finally {
		sound.setOnPlaybackStatusUpdate(null);
		if (!resolved) {
			await sound.unloadAsync();
		}
	}
}
