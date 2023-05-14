import React from 'react';
import {View, Text} from 'react-native';
import LottieView from 'lottie-react-native';
import lottieAnimation from '../../assets/lottie-updating.json';

const Updater: React.FC = () => {
  return (
    <View className="flex-1 justify-center items-center" style={{gap: 10}}>
      <LottieView
        source={lottieAnimation}
        loop
        autoPlay
        style={{
          width: 200,
          height: 200,
        }}
      />
      <Text className="text-2xl text-black">Loading...</Text>
    </View>
  );
};

export default Updater;
