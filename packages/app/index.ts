import App from './src/App';
import TrackPlayer from 'react-native-track-player';
import {registerRootComponent} from 'expo';
import {PlaybackService} from './src/services/PlaybackService';

registerRootComponent(App);
TrackPlayer.registerPlaybackService(() => PlaybackService);
