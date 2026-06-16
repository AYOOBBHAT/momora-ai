import { StyleSheet, Text, View } from 'react-native';

import { useAuthStore } from '../stores/auth.store';
import { useTheme } from '../theme/ThemeProvider';

export function SessionOfflineBanner() {
  const { theme } = useTheme();
  const isSessionOffline = useAuthStore((state) => state.isSessionOffline);

  if (!isSessionOffline) {
    return null;
  }

  return (
    <View
      style={[
        styles.banner,
        {
          backgroundColor: theme.colors.surfaceSecondary,
          borderBottomColor: theme.colors.border,
        },
      ]}
    >
      <Text
        style={[
          styles.text,
          {
            color: theme.colors.textSecondary,
            fontSize: theme.typography.fontSizes.sm,
          },
        ]}
      >
        You&apos;re offline. Your session is saved — reconnect to sync.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  text: {
    textAlign: 'center',
  },
});
