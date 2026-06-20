import { Ionicons } from '@expo/vector-icons';
import { useEffect, useRef, type ReactNode } from 'react';
import {
  Animated,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useTheme } from '../../../theme/ThemeProvider';

interface AuthFormLayoutProps {
  title: string;
  subtitle?: string;
  children: ReactNode;
  footer?: ReactNode;
  showBack?: boolean;
  onBack?: () => void;
}

export function AuthFormLayout({
  title,
  subtitle,
  children,
  footer,
  showBack = false,
  onBack,
}: AuthFormLayoutProps) {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(16)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 220,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 220,
        useNativeDriver: true,
      }),
    ]).start();
  }, [fadeAnim, slideAnim]);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={[styles.flex, { backgroundColor: theme.colors.background }]}
    >
      <ScrollView
        contentContainerStyle={[
          styles.content,
          {
            paddingTop: insets.top + theme.spacing.lg,
            paddingBottom: insets.bottom + theme.spacing.lg,
            paddingHorizontal: theme.spacing.lg,
          },
        ]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {showBack && onBack ? (
          <Pressable
            accessibilityLabel="Go back"
            accessibilityRole="button"
            hitSlop={12}
            onPress={onBack}
            style={({ pressed }) => [
              styles.backButton,
              { opacity: pressed ? 0.7 : 1 },
            ]}
          >
            <Ionicons color={theme.colors.text} name="chevron-back" size={24} />
          </Pressable>
        ) : null}

        <Animated.View
          style={{
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          }}
        >
          <View style={styles.brandBlock}>
            <View
              style={[
                styles.brandGlow,
                {
                  backgroundColor: `${theme.colors.primary}12`,
                  borderRadius: theme.radii.xl,
                },
              ]}
            />
            <Text
              style={[
                styles.brandTitle,
                {
                  color: theme.colors.primary,
                  fontSize: 26,
                  fontWeight: theme.typography.fontWeights.bold,
                },
              ]}
            >
              ✨ Memora AI
            </Text>
            <Text
              style={[
                styles.brandTagline,
                {
                  color: theme.colors.textSecondary,
                  fontSize: theme.typography.fontSizes.sm,
                },
              ]}
            >
              Your AI-powered knowledge companion
            </Text>
          </View>

          <View style={styles.headlineBlock}>
            <Text
              style={[
                styles.title,
                {
                  color: theme.colors.text,
                  fontSize: 24,
                  fontWeight: theme.typography.fontWeights.bold,
                },
              ]}
            >
              {title}
            </Text>
            {subtitle ? (
              <Text
                numberOfLines={2}
                style={[
                  styles.subtitle,
                  {
                    color: theme.colors.textSecondary,
                    fontSize: theme.typography.fontSizes.sm,
                    lineHeight: 22,
                  },
                ]}
              >
                {subtitle}
              </Text>
            ) : null}
          </View>

          <View style={styles.form}>{children}</View>

          {footer ? <View style={styles.footer}>{footer}</View> : null}
        </Animated.View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  content: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  backButton: {
    alignItems: 'center',
    height: 44,
    justifyContent: 'center',
    marginBottom: 8,
    marginLeft: -4,
    width: 44,
  },
  brandBlock: {
    alignItems: 'flex-start',
    gap: 6,
    marginBottom: 24,
    overflow: 'hidden',
    paddingVertical: 4,
  },
  brandGlow: {
    height: 72,
    left: -16,
    position: 'absolute',
    right: -16,
    top: -8,
  },
  brandTitle: {
    letterSpacing: -0.4,
  },
  brandTagline: {
    lineHeight: 20,
    maxWidth: 280,
  },
  headlineBlock: {
    gap: 8,
    marginBottom: 24,
  },
  title: {
    letterSpacing: -0.3,
  },
  subtitle: {},
  form: {
    gap: 16,
  },
  footer: {
    alignItems: 'center',
    marginTop: 24,
  },
});
