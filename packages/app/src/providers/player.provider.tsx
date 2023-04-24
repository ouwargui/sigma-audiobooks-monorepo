import React, {
  PropsWithChildren,
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import {Audio, InterruptionModeAndroid, InterruptionModeIOS} from 'expo-av';
import {Book} from '../routes/types';

export const PlayerContext = createContext<PlayerContextType>(
  {} as PlayerContextType,
);

type PlayerContextType = {
  currentBook: Book | undefined;
  setCurrentBook: React.Dispatch<React.SetStateAction<Book | undefined>>;
  currentChapter: number;
  isPlaying: boolean;
  setIsPlaying: React.Dispatch<React.SetStateAction<boolean>>;
  play: (index: number) => Promise<void>;
  pause: () => Promise<void>;
  resume: () => Promise<void>;
  skipToNext: () => Promise<void>;
  skipToPrevious: () => Promise<void>;
  changeVolume: (value: number) => Promise<void>;
  volume: number;
  durationMillis: number | undefined;
  currentMillis: number | undefined;
};

const PlayerProvider: React.FC<PropsWithChildren> = ({children}) => {
  const [currentBook, setCurrentBook] = useState<Book>();
  const [currentChapter, setCurrentChapter] = useState(1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [sound, setSound] = useState<Audio.Sound>();
  const [volume, setVolume] = useState(1);
  const [durationMillis, setDurationMillis] = useState<number>();
  const [currentMillis, setCurrentMillis] = useState<number>();
  const [bookLoaded, setBookLoaded] = useState(false);

  const setupAudio = useCallback(async () => {
    await Audio.setAudioModeAsync({
      staysActiveInBackground: true,
      allowsRecordingIOS: false,
      interruptionModeIOS: InterruptionModeIOS.DoNotMix,
      playsInSilentModeIOS: true,
      playThroughEarpieceAndroid: true,
      interruptionModeAndroid: InterruptionModeAndroid.DoNotMix,
    });
  }, []);

  const playSong = useCallback(
    async (index: number) => {
      await setupAudio();

      if (!currentBook) {
        return;
      }

      try {
        if (sound) {
          await sound.unloadAsync();
          setIsPlaying(false);
          setBookLoaded(false);
        }

        const newSoundUri = `${currentBook.contentUrl}/${currentBook.fileName}_${currentChapter}.${currentBook.fileExtension}`;
        console.log(newSoundUri);
        const {sound: newSound, status} = await Audio.Sound.createAsync(
          {uri: newSoundUri},
          {shouldPlay: true},
        );
        await newSound.setVolumeAsync(volume);
        if (status.isLoaded) {
          if (status.durationMillis) {
            setDurationMillis(status.durationMillis);
          }
          await newSound.setProgressUpdateIntervalAsync(1000);
          newSound.setOnPlaybackStatusUpdate((data) => {
            data.isLoaded && setCurrentMillis(data.positionMillis);
          });
          setIsPlaying(true);
          setBookLoaded(true);
        } else {
          status.error && console.log(status.error);
        }

        setSound(newSound);
        setCurrentChapter(index);
      } catch (error) {
        console.log(error);
      }
    },
    [setupAudio, currentBook, sound, currentChapter, volume],
  );

  const resume = useCallback(async () => {
    if (!sound) {
      return;
    }
    await sound.playAsync();
    setIsPlaying(true);
  }, [sound]);

  const play = useCallback(
    async (index: number) => {
      if (index === currentChapter && isPlaying) {
        return;
      }
      if (index === currentChapter && bookLoaded) {
        await resume();
        return;
      }
      await playSong(index);
    },
    [bookLoaded, currentChapter, isPlaying, playSong, resume],
  );

  const pause = useCallback(async () => {
    if (!sound) {
      return;
    }
    await sound.pauseAsync();
    setIsPlaying(false);
  }, [sound]);

  const skipToNext = useCallback(async () => {
    if (!currentBook) {
      return;
    }
    if (currentChapter < currentBook.totalChapters) {
      await play(currentChapter + 1);
    } else {
      await play(0);
    }
  }, [currentChapter, play, currentBook]);

  const skipToPrevious = useCallback(async () => {
    if (!currentBook) {
      return;
    }
    if (currentChapter > 0) {
      await play(currentChapter - 1);
    } else {
      await play(currentBook.totalChapters - 1);
    }
  }, [currentChapter, play, currentBook]);

  const changeVolume = useCallback(
    async (value: number) => {
      setVolume(value);
      if (!sound) {
        return;
      }
      await sound.setVolumeAsync(value);
    },
    [sound],
  );

  useEffect(() => {
    return () => {
      void sound?.unloadAsync();
    };
  }, [sound]);

  const returnValues = useMemo(
    () => ({
      currentBook,
      setCurrentBook,
      currentChapter,
      setIsPlaying,
      play,
      pause,
      resume,
      skipToNext,
      skipToPrevious,
      isPlaying,
      changeVolume,
      volume,
      durationMillis,
      currentMillis,
    }),
    [
      currentChapter,
      pause,
      play,
      currentBook,
      resume,
      skipToNext,
      skipToPrevious,
      isPlaying,
      changeVolume,
      volume,
      durationMillis,
      currentMillis,
    ],
  );

  return (
    <PlayerContext.Provider value={returnValues}>
      {children}
    </PlayerContext.Provider>
  );
};

export default PlayerProvider;
