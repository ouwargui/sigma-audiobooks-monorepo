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
  onPressIn?: () => void;
  onPressOut?: () => void;
  onLongPress?: (e: GestureResponderEvent) => void;
  scaleTo?: number;
  disabled?: boolean;
  bottomTabProps?: BottomTabBarButtonProps;
  className?: string;
  style?: PressableProps['style'];
}>;

const ScalableButton: React.FC<Props> = ({
  children,
  onPress,
  onPressIn,
  onPressOut,
  onLongPress,
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
      onPress={(e) => {
        onPress?.();
        bottomTabProps?.onPress?.(e);
      }}
      onLongPress={onLongPress}
      onPressIn={() => {
        isPressed.value = true;
        onPressIn?.();
      }}
      onPressOut={() => {
        isPressed.value = false;
        onPressOut?.();
      }}
      style={[scaleAnimationStyle, style, bottomTabProps?.style]}
    >
      {bottomTabProps?.children ?? children}
    </AnimatedPressable>
  );
};

export default ScalableButton;
