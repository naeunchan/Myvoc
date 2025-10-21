import { Audio } from "expo-av";

export async function playRemoteAudio(uri: string) {
	const { sound } = await Audio.Sound.createAsync({ uri });
	let resolved = false;

	try {
		await new Promise<void>((resolve, reject) => {
			sound.setOnPlaybackStatusUpdate((status) => {
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

			sound.playAsync().catch((error) => {
				if (!resolved) {
					resolved = true;
					void sound.unloadAsync().finally(() => {
						reject(error);
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
