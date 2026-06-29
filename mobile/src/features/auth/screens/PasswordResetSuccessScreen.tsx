import { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import { AuthFormLayout } from '../components/AuthFormLayout';
import { AuthPrimaryButton } from '../components/AuthPrimaryButton';
import type { AuthStackParamList } from '../../../navigation/types';
import { useTheme } from '../../../theme/ThemeProvider';

type Props = NativeStackScreenProps<AuthStackParamList, 'PasswordResetSuccess'>;

const AUTO_REDIRECT_MS = 4000;

export function PasswordResetSuccessScreen({ navigation }: Props) {
  const { theme } = useTheme();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.reset({
        index: 0,
        routes: [{ name: 'Login' }],
      });
    }, AUTO_REDIRECT_MS);

    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <AuthFormLayout
      brandTagline="Your knowledge workspace"
      subtitle="You can now sign in with your new password."
      title="Password updated"
    >
      <View style={styles.successBlock}>
        <View
          style={[
            styles.iconCircle,
            {
              backgroundColor: `${theme.colors.success}22`,
              borderRadius: theme.radii.full,
            },
          ]}
        >
          <Ionicons color={theme.colors.success} name="checkmark-circle" size={48} />
        </View>
        <Text
          style={[
            styles.successText,
            {
              color: theme.colors.text,
              fontSize: theme.typography.fontSizes.md,
              lineHeight: 22,
            },
          ]}
        >
          Password updated successfully.
        </Text>
      </View>

      <AuthPrimaryButton
        label="Continue to sign in"
        onPress={() =>
          navigation.reset({
            index: 0,
            routes: [{ name: 'Login' }],
          })
        }
      />
    </AuthFormLayout>
  );
}

const styles = StyleSheet.create({
  successBlock: {
    alignItems: 'center',
    gap: 16,
    marginBottom: 8,
  },
  iconCircle: {
    alignItems: 'center',
    height: 80,
    justifyContent: 'center',
    width: 80,
  },
  successText: {
    textAlign: 'center',
  },
});
