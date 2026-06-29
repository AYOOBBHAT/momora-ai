import { useCallback, type RefObject } from 'react';
import { Keyboard, type TextInputProps, type View } from 'react-native';

/**
 * Kept for API compatibility. Scrolling a focused input into view is now handled
 * natively by `KeyboardAwareScrollView`, so the returned handler is a no-op.
 */
export function useScrollInputIntoView(
  _containerRef: RefObject<View | null>,
): NonNullable<TextInputProps['onFocus']> {
  return useCallback(() => {}, []);
}

export function dismissKeyboard(): void {
  Keyboard.dismiss();
}
