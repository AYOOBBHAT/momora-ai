import { useCallback, useRef } from 'react';
import { type TextInputProps, type View } from 'react-native';

/**
 * Preserves the field API used across forms. Scrolling a focused input into
 * view is now handled natively by `KeyboardAwareScrollView`, so this hook only
 * forwards the focus event. `fieldRef` is kept so existing field wrappers that
 * attach it continue to work unchanged.
 */
export function useInputScrollOnFocus() {
  const fieldRef = useRef<View>(null);

  const createFocusHandler = useCallback(
    (existingOnFocus?: TextInputProps['onFocus']): TextInputProps['onFocus'] =>
      (event) => {
        existingOnFocus?.(event);
      },
    [],
  );

  return { fieldRef, createFocusHandler };
}
