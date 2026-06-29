import { StyleSheet, Text, View } from 'react-native';

import { useTheme } from '../../../theme/ThemeProvider';
import {
  getAppBuildNumber,
  getAppPlatformLabel,
  getAppVersion,
} from '../utils/appInfo';

interface InfoRowProps {
  label: string;
  value: string;
}

function InfoRow({ label, value }: InfoRowProps) {
  const { theme } = useTheme();

  return (
    <View style={styles.infoRow}>
      <Text
        style={[
          styles.infoLabel,
          {
            color: theme.colors.textMuted,
            fontSize: theme.typography.fontSizes.xs,
            fontWeight: theme.typography.fontWeights.medium,
          },
        ]}
      >
        {label}
      </Text>
      <Text
        style={[
          styles.infoValue,
          {
            color: theme.colors.text,
            fontSize: theme.typography.fontSizes.sm,
            fontWeight: theme.typography.fontWeights.medium,
          },
        ]}
      >
        {value}
      </Text>
    </View>
  );
}

export function FeedbackAppInfoCard() {
  const { theme } = useTheme();

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: theme.colors.surfaceElevated,
          borderColor: `${theme.colors.border}AA`,
          borderRadius: theme.radii.lg,
        },
      ]}
    >
      <Text
        style={[
          styles.heading,
          {
            color: theme.colors.textSecondary,
            fontSize: theme.typography.fontSizes.xs,
            fontWeight: theme.typography.fontWeights.semibold,
          },
        ]}
      >
        APP INFORMATION
      </Text>
      <Text
        style={[
          styles.hint,
          {
            color: theme.colors.textMuted,
            fontSize: theme.typography.fontSizes.xs,
            lineHeight: 18,
          },
        ]}
      >
        Reference these details when reporting issues during the Closed Beta.
      </Text>
      <InfoRow label="Version" value={getAppVersion()} />
      <InfoRow label="Build Number" value={getAppBuildNumber()} />
      <InfoRow label="Platform" value={getAppPlatformLabel()} />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderWidth: StyleSheet.hairlineWidth,
    gap: 10,
    paddingHorizontal: 14,
    paddingVertical: 14,
  },
  heading: {
    letterSpacing: 0.6,
  },
  hint: {},
  infoRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  infoLabel: {
    letterSpacing: 0.3,
    textTransform: 'uppercase',
  },
  infoValue: {},
});
