import { useMemo, type ReactNode } from 'react';
import {
  Keyboard,
  Pressable,
  StyleSheet,
  View,
  type ScrollViewProps,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import {
  KeyboardAvoidingView,
  KeyboardAwareScrollView,
} from 'react-native-keyboard-controller';
import { SafeAreaView, type Edge } from 'react-native-safe-area-context';

import { useKeyboardInset } from '../../hooks/useKeyboardInset';
import { KeyboardScrollContext } from './KeyboardScrollContext';

type BaseProps = {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
  backgroundColor?: string;
};

type ComposerProps = BaseProps & {
  variant: 'composer';
  footer: ReactNode;
  /** Safe area edges when the keyboard is hidden. Defaults to bottom only. */
  safeAreaEdges?: Edge[];
};

type ScrollProps = BaseProps & {
  variant: 'scroll';
  contentContainerStyle?: StyleProp<ViewStyle>;
  footer?: ReactNode;
  /** Extra gap kept between a focused input and the keyboard. */
  keyboardVerticalOffset?: number;
  scrollViewProps?: Omit<
    ScrollViewProps,
    'children' | 'contentContainerStyle' | 'style' | 'ref' | 'onScroll'
  >;
};

export type KeyboardAwareScreenProps = ComposerProps | ScrollProps;

const DEFAULT_BOTTOM_OFFSET = 24;

export function KeyboardAwareScreen(props: KeyboardAwareScreenProps) {
  if (props.variant === 'composer') {
    return <KeyboardAwareComposerScreen {...props} />;
  }

  return <KeyboardAwareScrollScreen {...props} />;
}

/**
 * Docked-footer layout (e.g. the chat composer). The footer is kept directly
 * above the keyboard via a native keyboard-avoiding container, so the content
 * area shrinks and the input never sits behind the keyboard.
 */
function KeyboardAwareComposerScreen({
  children,
  footer,
  style,
  backgroundColor,
  safeAreaEdges = ['bottom'],
}: ComposerProps) {
  const { isKeyboardVisible } = useKeyboardInset();

  const edges = useMemo(
    () => (isKeyboardVisible ? ([] as Edge[]) : safeAreaEdges),
    [isKeyboardVisible, safeAreaEdges],
  );

  return (
    <View style={[styles.flex, backgroundColor ? { backgroundColor } : null, style]}>
      <SafeAreaView edges={edges} style={styles.flex}>
        <KeyboardAvoidingView automaticOffset behavior="padding" style={styles.flex}>
          <View style={styles.flex}>{children}</View>
          {footer}
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}

/**
 * Scrolling-form layout (auth, document/collection forms, onboarding note).
 * The keyboard-aware scroll view automatically scrolls the focused input into
 * view and keeps it above the keyboard on both platforms.
 */
function KeyboardAwareScrollScreen({
  children,
  contentContainerStyle,
  style,
  backgroundColor,
  footer,
  keyboardVerticalOffset = 0,
  scrollViewProps,
}: ScrollProps) {
  // Manual scroll-into-view is now handled natively by the scroll view, so the
  // context exposes no-ops while preserving the public hook API used by fields.
  const scrollContextValue = useMemo(
    () => ({
      scrollToInput: () => {},
      registerFocusedInput: () => {},
    }),
    [],
  );

  const bottomOffset = keyboardVerticalOffset > 0 ? keyboardVerticalOffset : DEFAULT_BOTTOM_OFFSET;

  return (
    <KeyboardScrollContext.Provider value={scrollContextValue}>
      <View style={[styles.flex, backgroundColor ? { backgroundColor } : null, style]}>
        <Pressable
          accessibilityRole="none"
          accessible={false}
          onPress={Keyboard.dismiss}
          style={styles.flex}
        >
          <KeyboardAwareScrollView
            bottomOffset={bottomOffset}
            contentContainerStyle={[styles.scrollContent, contentContainerStyle]}
            keyboardDismissMode="on-drag"
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
            style={styles.flex}
            {...scrollViewProps}
          >
            {children}
            {footer}
          </KeyboardAwareScrollView>
        </Pressable>
      </View>
    </KeyboardScrollContext.Provider>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
});
