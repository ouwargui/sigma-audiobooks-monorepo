import {BlurView} from 'expo-blur';
import React, {PropsWithChildren} from 'react';
import {View, Text, ScrollView} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

type Props = PropsWithChildren<{
  title: string;
}>;

const Wrapper: React.FC<Props> = ({children, title}) => {
  const insets = useSafeAreaInsets();

  return (
    <View className="flex-1 bg-white">
      <ScrollView contentContainerStyle={{paddingTop: insets.top * 2}}>
        <View className="flex-1">{children}</View>
      </ScrollView>
      <BlurView
        tint="light"
        intensity={40}
        className="top-0 left-0 right-0 absolute justify-end items-start rounded-lg"
        style={{height: insets.top * 2}}
      >
        <Text className="font-semiBold pl-4 text-5xl">{title}</Text>
      </BlurView>
    </View>
  );
};

export default Wrapper;
