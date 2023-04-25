import TrackPlayer, {
  AppKilledPlaybackBehavior,
  Capability,
  Event,
} from 'react-native-track-player';

export const setupPlayer = async () => {
  let isSetup = false;
  try {
    await TrackPlayer.getCurrentTrack();
    isSetup = true;
  } catch {
    await TrackPlayer.setupPlayer();
    await TrackPlayer.updateOptions({
      android: {
        appKilledPlaybackBehavior:
          AppKilledPlaybackBehavior.StopPlaybackAndRemoveNotification,
      },
      capabilities: [
        Capability.Play,
        Capability.Pause,
        Capability.SkipToNext,
        Capability.SkipToPrevious,
        Capability.SeekTo,
        Capability.SetRating,
        Capability.Bookmark,
      ],
      compactCapabilities: [
        Capability.Play,
        Capability.Pause,
        Capability.SkipToNext,
      ],
      progressUpdateEventInterval: 1,
    });

    isSetup = true;
  }
  return isSetup;
};

// eslint-disable-next-line
export const PlaybackService = async () => {
  TrackPlayer.addEventListener(Event.RemotePlay, () => void TrackPlayer.play());
  TrackPlayer.addEventListener(
    Event.RemotePause,
    () => void TrackPlayer.pause(),
  );
  TrackPlayer.addEventListener(
    Event.RemoteNext,
    () => void TrackPlayer.skipToNext(),
  );
  TrackPlayer.addEventListener(
    Event.RemotePrevious,
    () => void TrackPlayer.skipToNext(),
  );
};
