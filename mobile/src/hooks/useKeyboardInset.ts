import {
  useKeyboardAnimation,
  useKeyboardState,
  type AnimatedContext,
} from 'react-native-keyboard-controller';

export type KeyboardInsetState = {
  isKeyboardVisible: boolean;
  /**
   * Animated keyboard height (0 when hidden). Driven natively by
   * react-native-keyboard-controller, so it is correct on iOS and on Android
   * under edge-to-edge — no dependency on the legacy `adjustResize` window resize.
   */
  footerPadding: AnimatedContext['height'];
};

/**
 * Single source of truth for keyboard visibility and height across the app.
 * Backed by react-native-keyboard-controller's native insets, which work
 * identically on iOS and Android (including Expo SDK 56 edge-to-edge).
 */
export function useKeyboardInset(): KeyboardInsetState {
  const { height } = useKeyboardAnimation();
  const isKeyboardVisible = useKeyboardState((state) => state.isVisible);

  return { isKeyboardVisible, footerPadding: height };
}
