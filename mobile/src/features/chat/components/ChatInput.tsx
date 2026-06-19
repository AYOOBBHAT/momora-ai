import { Ionicons } from '@expo/vector-icons';
import { forwardRef } from 'react';
import { Pressable, StyleSheet, TextInput, View, type TextInput as TextInputType } from 'react-native';

import { useTheme } from '../../../theme/ThemeProvider';

interface ChatInputProps {
  value: string;
  onChangeText: (text: string) => void;
  onSend: () => void;
  disabled?: boolean;
  placeholder?: string;
  onFocus?: () => void;
  onBlur?: () => void;
}

export const ChatInput = forwardRef<TextInputType, ChatInputProps>(function ChatInput(
  {
  value,
  onChangeText,
  onSend,
  disabled = false,
  placeholder = 'Ask a question…',
  onFocus,
  onBlur,
  },
  ref,
) {
  const { theme } = useTheme();
  const trimmed = value.trim();
  const canSend = trimmed.length > 0 && !disabled;

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: theme.colors.surface,
          borderTopColor: theme.colors.border,
        },
      ]}
    >
      <TextInput
        ref={ref}
        editable={!disabled}
        multiline
        onBlur={onBlur}
        onChangeText={onChangeText}
        onFocus={onFocus}
        placeholder={placeholder}
        placeholderTextColor={theme.colors.textSecondary}
        style={[
          styles.input,
          {
            backgroundColor: theme.colors.surfaceElevated,
            borderColor: theme.colors.border,
            color: theme.colors.text,
            fontSize: theme.typography.fontSizes.md,
          },
        ]}
        value={value}
      />
      <Pressable
        accessibilityLabel="Send message"
        accessibilityRole="button"
        disabled={!canSend}
        onPress={onSend}
        style={({ pressed }) => [
          styles.sendButton,
          {
            backgroundColor: canSend ? theme.colors.primary : theme.colors.surfaceSecondary,
            opacity: pressed && canSend ? 0.85 : 1,
          },
        ]}
      >
        <Ionicons
          color={canSend ? theme.colors.primaryText : theme.colors.textSecondary}
          name="send"
          size={20}
        />
      </Pressable>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    alignItems: 'flex-end',
    borderTopWidth: StyleSheet.hairlineWidth,
    flexDirection: 'row',
    gap: 10,
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 12,
  },
  input: {
    borderRadius: 22,
    borderWidth: 1,
    flex: 1,
    maxHeight: 120,
    minHeight: 46,
    paddingHorizontal: 18,
    paddingTop: 11,
    paddingBottom: 11,
  },
  sendButton: {
    alignItems: 'center',
    borderRadius: 23,
    height: 46,
    justifyContent: 'center',
    width: 46,
  },
});
