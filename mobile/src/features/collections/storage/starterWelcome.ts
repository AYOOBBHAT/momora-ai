import AsyncStorage from '@react-native-async-storage/async-storage';

const STARTER_WELCOME_DISMISSED_PREFIX = 'memora.starterWelcomeDismissed';

function getStarterWelcomeStorageKey(userId: string): string {
  return `${STARTER_WELCOME_DISMISSED_PREFIX}:${userId}`;
}

export async function getStarterWelcomeDismissed(userId: string): Promise<boolean> {
  const value = await AsyncStorage.getItem(getStarterWelcomeStorageKey(userId));
  return value === 'true';
}

export async function setStarterWelcomeDismissed(userId: string): Promise<void> {
  await AsyncStorage.setItem(getStarterWelcomeStorageKey(userId), 'true');
}
