import React, {
  PropsWithChildren,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import TrackPlayer, {
  Event,
  State,
  usePlaybackState,
  useProgress,
  useTrackPlayerEvents,
} from 'react-native-track-player';
import {Book} from '../routes/types';

type PlayerContextType = {
  position: number;
  duration: number;
  loadBook: (book: Book) => Promise<void>;
  togglePlay: () => Promise<void>;
  seekTo: (time: number) => Promise<void>;
  skipToNext: () => Promise<void>;
  skipToPrevious: () => Promise<void>;
  setRate: (rate: number) => Promise<void>;
  currentRate: number;
  isPlaying: boolean;
  currentVolume: number;
  setVolume: (volume: number) => Promise<void>;
  currentChapter: number;
  currentBook?: Book;
};

export const PlayerContext = React.createContext<PlayerContextType>(
  {} as PlayerContextType,
);

const events: Event[] = [Event.PlaybackError, Event.PlaybackTrackChanged];

const PlayerProvider: React.FC<PropsWithChildren> = ({children}) => {
  const [currentBook, setCurrentBook] = useState<Book>();
  const [currentRate, setCurrentRate] = useState(1);
  const [currentVolume, setCurrentVolume] = useState(1);
  const [currentChapter, setCurrentChapter] = useState(1);
  const {position, duration} = useProgress();
  const playbackState = usePlaybackState();
  const isPlaying = playbackState === State.Playing;

  const loadBook = useCallback(async (book: Book) => {
    await TrackPlayer.reset();
    setCurrentBook(book);
    setCurrentChapter(1);
    for (let i = 0; i < book.totalChapters; i++) {
      await TrackPlayer.add({
        id: `${book.id}-${i}`,
        url: `${book.contentUrl}/${book.fileName}_${i + 1}.${
          book.fileExtension
        }`,
        title: book.title,
        artist: book.author,
        artwork: book.coverArtUrl,
        description: `Chapter ${i + 1}`,
      });
    }
  }, []);

  const togglePlay = useCallback(async () => {
    if (!currentBook) {
      return;
    }

    playbackState !== State.Playing
      ? await TrackPlayer.play()
      : await TrackPlayer.pause();
  }, [playbackState, currentBook]);

  const seekTo = useCallback(async (time: number) => {
    await TrackPlayer.seekTo(time);
  }, []);

  const skipToNext = useCallback(async () => {
    const currentTrackIndex = await TrackPlayer.getCurrentTrack();
    if ((!currentTrackIndex && currentTrackIndex !== 0) || !currentBook) {
      return;
    }

    if (currentTrackIndex + 1 < currentBook.totalChapters) {
      await TrackPlayer.skipToNext();
    } else {
      await TrackPlayer.seekTo(duration);
    }
  }, [currentBook, duration]);

  const skipToPrevious = useCallback(async () => {
    const currentTrackIndex = await TrackPlayer.getCurrentTrack();
    if (!currentTrackIndex && currentTrackIndex !== 0) {
      return;
    }

    if (position > 3) {
      await TrackPlayer.seekTo(0);
      return;
    }

    if (currentTrackIndex - 1 >= 0) {
      await TrackPlayer.skipToPrevious();
      return;
    }

    await TrackPlayer.seekTo(0);
  }, [position]);

  const setRate = useCallback(async (rate: number) => {
    await TrackPlayer.setRate(rate);
    setCurrentRate(rate);
  }, []);

  const setVolume = useCallback(async (volume: number) => {
    await TrackPlayer.setVolume(volume);
    setCurrentVolume(volume);
  }, []);

  useTrackPlayerEvents(events, (e) => {
    if (e.type === Event.PlaybackError) {
      console.error(e.message);
      void TrackPlayer.reset();
      return;
    }

    if (e.type === Event.PlaybackTrackChanged) {
      setCurrentChapter(e.nextTrack + 1);
    }
  });

  useEffect(() => {
    return () => {
      console.log('limpei');
      void TrackPlayer.reset();
      setCurrentBook(undefined);
      setCurrentChapter(1);
    };
  }, []);

  const returnValues = useMemo(
    () => ({
      position,
      duration,
      loadBook,
      togglePlay,
      seekTo,
      skipToNext,
      skipToPrevious,
      setRate,
      currentRate,
      isPlaying,
      currentVolume,
      setVolume,
      currentChapter,
      currentBook,
    }),
    [
      position,
      duration,
      loadBook,
      togglePlay,
      seekTo,
      skipToNext,
      skipToPrevious,
      setRate,
      currentRate,
      isPlaying,
      currentVolume,
      setVolume,
      currentChapter,
      currentBook,
    ],
  );

  return (
    <PlayerContext.Provider value={returnValues}>
      {children}
    </PlayerContext.Provider>
  );
};

export default PlayerProvider;
