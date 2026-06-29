import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { ForgotPasswordScreen } from '../features/auth/screens/ForgotPasswordScreen';
import { LoginScreen } from '../features/auth/screens/LoginScreen';
import { PasswordResetSuccessScreen } from '../features/auth/screens/PasswordResetSuccessScreen';
import { RegisterScreen } from '../features/auth/screens/RegisterScreen';
import { ResetPasswordScreen } from '../features/auth/screens/ResetPasswordScreen';
import { VerifyResetOtpScreen } from '../features/auth/screens/VerifyResetOtpScreen';
import { useTheme } from '../theme/ThemeProvider';
import type { AuthStackParamList } from './types';

const Stack = createNativeStackNavigator<AuthStackParamList>();

export function AuthStack() {
  const { theme } = useTheme();

  return (
    <Stack.Navigator
      initialRouteName="Login"
      screenOptions={{
        headerStyle: { backgroundColor: theme.colors.background },
        headerTintColor: theme.colors.text,
        headerShadowVisible: false,
        contentStyle: { backgroundColor: theme.colors.background },
      }}
    >
      <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Register" component={RegisterScreen} options={{ headerShown: false }} />
      <Stack.Screen
        name="ForgotPassword"
        component={ForgotPasswordScreen}
        options={{ title: 'Forgot password' }}
      />
      <Stack.Screen
        name="VerifyResetOtp"
        component={VerifyResetOtpScreen}
        options={{ title: 'Verify code' }}
      />
      <Stack.Screen
        name="ResetPassword"
        component={ResetPasswordScreen}
        options={{ title: 'New password' }}
      />
      <Stack.Screen
        name="PasswordResetSuccess"
        component={PasswordResetSuccessScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}
