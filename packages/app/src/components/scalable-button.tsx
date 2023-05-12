import {BottomTabBarButtonProps} from '@react-navigation/bottom-tabs';
import React, {PropsWithChildren} from 'react';
import {GestureResponderEvent, Pressable, PressableProps} from 'react-native';
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
  onPress?: () => void;
  onLongPress?: (e: GestureResponderEvent) => void;
  onPressIn?: (e: GestureResponderEvent) => void;
  onPressOut?: (e: GestureResponderEvent) => void;
  scaleTo?: number;
  disabled?: boolean;
  bottomTabProps?: BottomTabBarButtonProps;
  className?: string;
  style?: PressableProps['style'];
}>;

const ScalableButton: React.FC<Props> = ({
  children,
  onPress,
  onLongPress,
  onPressIn,
  onPressOut,
  scaleTo = 0.85,
  disabled = false,
  bottomTabProps,
  style,
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
    };
  });

  return (
    <AnimatedPressable
      disabled={disabled}
      onPress={onPress}
      onLongPress={onLongPress}
      onPressIn={(e) => {
        isPressed.value = true;
        onPressIn?.(e);
      }}
      onPressOut={(e) => {
        isPressed.value = false;
        onPressOut?.(e);
      }}
      style={[scaleAnimationStyle, style]}
      {...bottomTabProps}
    >
      {children}
    </AnimatedPressable>
  );
};

export default ScalableButton;
