import {
  ActivityIndicator,
  Alert,
  Linking,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { env } from '../../../config/env';
import { useAuthMe } from '../../../hooks/queries/useAuthMe';
import { useLogout } from '../../../hooks/mutations/useLogout';
import { getApiErrorMessage } from '../../../lib/apiError';
import { useTheme } from '../../../theme/ThemeProvider';

function openExternalUrl(url: string, label: string) {
  if (!url) {
    Alert.alert(
      `${label} unavailable`,
      `${label} URL is not configured. Set the corresponding EXPO_PUBLIC_* variable.`,
    );
    return;
  }

  void Linking.openURL(url).catch(() => {
    Alert.alert('Unable to open link', `Could not open ${label}.`);
  });
}

interface ProfileMenuItemProps {
  label: string;
  onPress: () => void;
}

function ProfileMenuItem({ label, onPress }: ProfileMenuItemProps) {
  const { theme } = useTheme();

  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [
        styles.menuItem,
        {
          backgroundColor: theme.colors.surface,
          borderColor: theme.colors.border,
          borderRadius: theme.radii.md,
          opacity: pressed ? 0.9 : 1,
        },
      ]}
    >
      <Text
        style={[
          styles.menuItemText,
          {
            color: theme.colors.text,
            fontSize: theme.typography.fontSizes.md,
            fontWeight: theme.typography.fontWeights.medium,
          },
        ]}
      >
        {label}
      </Text>
    </Pressable>
  );
}

function getInitials(name?: string): string {
  if (!name?.trim()) {
    return '?';
  }

  const parts = name.trim().split(/\s+/);
  return parts
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('');
}

export function ProfileScreen() {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const { data: user, isLoading } = useAuthMe();
  const logout = useLogout();

  return (
    <ScrollView
      contentContainerStyle={[
        styles.container,
        {
          paddingTop: insets.top + theme.spacing.lg,
          paddingBottom: insets.bottom + theme.spacing.lg,
        },
      ]}
      style={{ backgroundColor: theme.colors.background }}
    >
      <Text
        style={[
          styles.title,
          {
            color: theme.colors.text,
            fontSize: theme.typography.fontSizes.xl,
            fontWeight: theme.typography.fontWeights.bold,
          },
        ]}
      >
        Profile
      </Text>

      {isLoading ? (
        <ActivityIndicator color={theme.colors.primary} style={styles.loader} />
      ) : user ? (
        <View
          style={[
            styles.profileCard,
            theme.elevation.soft,
            {
              backgroundColor: theme.colors.surface,
              borderColor: theme.colors.border,
              borderRadius: theme.radii.lg,
            },
          ]}
        >
          <View
            style={[
              styles.avatar,
              {
                backgroundColor: `${theme.colors.primary}22`,
                borderRadius: theme.radii.full,
              },
            ]}
          >
            <Text
              style={[
                styles.avatarText,
                {
                  color: theme.colors.primary,
                  fontSize: theme.typography.fontSizes.lg,
                  fontWeight: theme.typography.fontWeights.bold,
                },
              ]}
            >
              {getInitials(user.name)}
            </Text>
          </View>
          <Text
            style={[
              styles.name,
              {
                color: theme.colors.text,
                fontSize: theme.typography.fontSizes.lg,
                fontWeight: theme.typography.fontWeights.semibold,
              },
            ]}
          >
            {user.name}
          </Text>
          <Text
            style={[
              styles.email,
              {
                color: theme.colors.textSecondary,
                fontSize: theme.typography.fontSizes.sm,
              },
            ]}
          >
            {user.email}
          </Text>
        </View>
      ) : (
        <Text
          style={[
            styles.subtitle,
            {
              color: theme.colors.textSecondary,
              fontSize: theme.typography.fontSizes.md,
            },
          ]}
        >
          Unable to load profile
        </Text>
      )}

      <View style={styles.menu}>
        <ProfileMenuItem
          label="Privacy Policy"
          onPress={() => openExternalUrl(env.privacyPolicyUrl, 'Privacy Policy')}
        />
        <ProfileMenuItem
          label="Terms of Service"
          onPress={() => openExternalUrl(env.termsOfServiceUrl, 'Terms of Service')}
        />
      </View>

      {logout.error ? (
        <Text style={[styles.error, { color: theme.colors.error }]}>
          {getApiErrorMessage(logout.error, 'Logout failed')}
        </Text>
      ) : null}

      <Pressable
        accessibilityRole="button"
        disabled={logout.isPending}
        onPress={() => logout.mutate()}
        style={({ pressed }) => [
          styles.logoutButton,
          {
            backgroundColor: theme.colors.surface,
            borderColor: theme.colors.border,
            borderRadius: theme.radii.md,
            opacity: pressed || logout.isPending ? 0.85 : 1,
          },
        ]}
      >
        {logout.isPending ? (
          <ActivityIndicator color={theme.colors.primary} />
        ) : (
          <Text
            style={[
              styles.logoutText,
              {
                color: theme.colors.error,
                fontSize: theme.typography.fontSizes.md,
                fontWeight: theme.typography.fontWeights.semibold,
              },
            ]}
          >
            Log out
          </Text>
        )}
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    paddingHorizontal: 16,
    gap: 16,
  },
  title: {
    marginBottom: 4,
  },
  loader: {
    marginVertical: 24,
  },
  profileCard: {
    alignItems: 'center',
    borderWidth: 1,
    padding: 24,
    gap: 8,
  },
  avatar: {
    width: 72,
    height: 72,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  avatarText: {},
  name: {
    textAlign: 'center',
  },
  email: {
    textAlign: 'center',
  },
  subtitle: {
    textAlign: 'center',
  },
  menu: {
    gap: 10,
    marginTop: 8,
  },
  menuItem: {
    minHeight: 52,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  menuItemText: {},
  error: {
    fontSize: 14,
    textAlign: 'center',
  },
  logoutButton: {
    marginTop: 8,
    minHeight: 52,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  logoutText: {
    textAlign: 'center',
  },
});
