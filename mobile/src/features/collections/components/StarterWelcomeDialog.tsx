import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';

import { useTheme } from '../../../theme/ThemeProvider';

interface StarterWelcomeDialogProps {
  visible: boolean;
  onDismiss: () => void;
}

export function StarterWelcomeDialog({ visible, onDismiss }: StarterWelcomeDialogProps) {
  const { theme } = useTheme();

  return (
    <Modal animationType="fade" onRequestClose={onDismiss} transparent visible={visible}>
      <View style={styles.overlay}>
        <Pressable accessibilityRole="button" onPress={onDismiss} style={styles.backdrop} />
        <View
          style={[
            styles.card,
            {
              backgroundColor: theme.colors.surface,
              borderColor: theme.colors.border,
              borderRadius: theme.radii.lg,
            },
          ]}
        >
          <Text
            style={[
              styles.title,
              {
                color: theme.colors.text,
                fontSize: theme.typography.h3.fontSize,
                fontWeight: theme.typography.h3.fontWeight,
                lineHeight: theme.typography.h3.lineHeight,
              },
            ]}
          >
            Welcome to Memora 👋
          </Text>
          <Text
            style={[
              styles.message,
              {
                color: theme.colors.textMuted,
                fontSize: theme.typography.body.fontSize,
                lineHeight: theme.typography.body.lineHeight,
              },
            ]}
          >
            We've created a few starter collections to help you organize your knowledge.{'\n\n'}
            You can rename, edit, or delete them at any time.
          </Text>
          <Pressable
            accessibilityRole="button"
            onPress={onDismiss}
            style={({ pressed }) => [
              styles.button,
              {
                backgroundColor: theme.colors.primary,
                borderRadius: theme.radii.lg,
                opacity: pressed ? 0.88 : 1,
              },
            ]}
          >
            <Text
              style={[
                styles.buttonText,
                {
                  color: theme.colors.primaryText,
                  fontSize: theme.typography.bodyLarge.fontSize,
                  fontWeight: theme.typography.fontWeights.semibold,
                },
              ]}
            >
              Got it
            </Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  backdrop: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
  },
  card: {
    borderWidth: StyleSheet.hairlineWidth,
    gap: 16,
    maxWidth: 360,
    paddingHorizontal: 24,
    paddingVertical: 28,
    width: '100%',
  },
  title: {
    textAlign: 'center',
  },
  message: {
    textAlign: 'center',
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 4,
    minHeight: 48,
    paddingHorizontal: 24,
  },
  buttonText: {},
});
