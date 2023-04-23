import {BottomTabBarButtonProps} from '@react-navigation/bottom-tabs';
import React, {PropsWithChildren} from 'react';
import {Pressable, PressableProps} from 'react-native';
import Animated, {
  Easing,
  Extrapolate,
  interpolate,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);
const timingConfig = {duration: 50, easing: Easing.linear};

type Props = PropsWithChildren<{
  onPress: () => void;
  scaleTo?: number;
  disabled?: boolean;
  bottomTabProps?: BottomTabBarButtonProps;
  props?: PressableProps;
}>;

const ScalableButton: React.FC<Props> = ({
  children,
  onPress,
  scaleTo = 0.85,
  disabled = false,
  bottomTabProps,
  props,
}) => {
  const isPressed = useSharedValue(false);
  const scale = useDerivedValue(() => {
    return isPressed.value
      ? withTiming(1, timingConfig)
      : withTiming(0, timingConfig);
  });

  const scaleAnimationStyle = useAnimatedStyle(() => {
    const scaleValue = interpolate(
      scale.value,
      [0, 1],
      [1, scaleTo],
      Extrapolate.CLAMP,
    );

    return {
      transform: [{scale: scaleValue}],
      flex: 1,
    };
  });
  return (
    <AnimatedPressable
      disabled={disabled}
      onPress={onPress}
      onPressIn={() => (isPressed.value = true)}
      onPressOut={() => (isPressed.value = false)}
      style={scaleAnimationStyle}
      {...bottomTabProps}
      {...props}
    >
      {children}
    </AnimatedPressable>
  );
};

export default ScalableButton;
