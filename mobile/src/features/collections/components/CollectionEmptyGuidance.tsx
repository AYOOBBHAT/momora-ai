import { Ionicons } from '@expo/vector-icons';

import type { ComponentProps } from 'react';

import { Pressable, StyleSheet, Text, View } from 'react-native';



import { useTheme } from '../../../theme/ThemeProvider';



type AddContentFlow = 'pdf' | 'url' | 'youtube' | 'note';

type IoniconName = ComponentProps<typeof Ionicons>['name'];



interface QuickAddOption {

  id: AddContentFlow;

  label: string;

  icon: IoniconName;

}



const QUICK_ADD_OPTIONS: QuickAddOption[] = [

  { id: 'pdf', label: 'PDF', icon: 'document-text-outline' },

  { id: 'url', label: 'Website', icon: 'globe-outline' },

  { id: 'youtube', label: 'YouTube Video', icon: 'logo-youtube' },

  { id: 'note', label: 'Note', icon: 'create-outline' },

];



interface CollectionEmptyGuidanceProps {

  onSelectFlow: (flow: AddContentFlow) => void;

}



export function CollectionEmptyGuidance({ onSelectFlow }: CollectionEmptyGuidanceProps) {

  const { theme } = useTheme();



  return (

    <View

      style={[

        styles.container,

        {

          backgroundColor: theme.colors.surface,

          borderColor: theme.colors.border,

          borderRadius: theme.radii.lg,

        },

      ]}

    >

      <View

        style={[

          styles.iconWrap,

          {

            backgroundColor: theme.colors.surfaceElevated,

            borderColor: theme.colors.border,

            borderRadius: theme.radii.md,

          },

        ]}

      >

        <Ionicons color={theme.colors.icon} name="folder-open-outline" size={22} />

      </View>

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

        This collection is empty.

      </Text>

      <Text

        style={[

          styles.subtitle,

          {

            color: theme.colors.textMuted,

            fontSize: theme.typography.body.fontSize,

            lineHeight: theme.typography.body.lineHeight,

          },

        ]}

      >

        Start by adding:

      </Text>



      <View style={styles.bulletList}>

        {QUICK_ADD_OPTIONS.map((option) => (

          <Text

            key={option.id}

            style={[

              styles.bulletItem,

              {

                color: theme.colors.textSecondary,

                fontSize: theme.typography.fontSizes.sm,

                lineHeight: 20,

              },

            ]}

          >

            • {option.label}

          </Text>

        ))}

      </View>



      <View style={styles.actions}>

        {QUICK_ADD_OPTIONS.map((option) => (

          <Pressable

            key={option.id}

            accessibilityRole="button"

            accessibilityLabel={`Add ${option.label}`}

            onPress={() => onSelectFlow(option.id)}

            style={({ pressed }) => [

              styles.actionButton,

              {

                backgroundColor: theme.colors.surfaceElevated,

                borderColor: theme.colors.border,

                borderRadius: theme.radii.lg,

                opacity: pressed ? 0.85 : 1,

              },

            ]}

          >

            <Ionicons color={theme.colors.primary} name={option.icon} size={18} />

            <Text

              style={[

                styles.actionLabel,

                {

                  color: theme.colors.text,

                  fontSize: theme.typography.fontSizes.sm,

                  fontWeight: theme.typography.fontWeights.medium,

                },

              ]}

            >

              {option.label}

            </Text>

          </Pressable>

        ))}

      </View>

    </View>

  );

}



const styles = StyleSheet.create({

  container: {

    alignItems: 'center',

    borderWidth: StyleSheet.hairlineWidth,

    gap: 10,

    paddingHorizontal: 20,

    paddingVertical: 28,

  },

  iconWrap: {

    alignItems: 'center',

    borderWidth: StyleSheet.hairlineWidth,

    height: 44,

    justifyContent: 'center',

    marginBottom: 4,

    width: 44,

  },

  title: {

    textAlign: 'center',

  },

  subtitle: {

    marginTop: 4,

    textAlign: 'center',

  },

  bulletList: {

    alignSelf: 'stretch',

    gap: 4,

    marginBottom: 8,

    paddingHorizontal: 8,

  },

  bulletItem: {},

  actions: {

    alignSelf: 'stretch',

    flexDirection: 'row',

    flexWrap: 'wrap',

    gap: 10,

    justifyContent: 'center',

    marginTop: 8,

  },

  actionButton: {

    alignItems: 'center',

    borderWidth: StyleSheet.hairlineWidth,

    flexDirection: 'row',

    gap: 8,

    minHeight: 44,

    paddingHorizontal: 14,

    paddingVertical: 10,

  },

  actionLabel: {},

});

