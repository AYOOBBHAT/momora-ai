import type { ComponentProps } from 'react';

import { Ionicons } from '@expo/vector-icons';

type IoniconName = ComponentProps<typeof Ionicons>['name'];

export const IONICON_PREFIX = 'ion:';

/**
 * Stable icon identifiers used by starter collections (seeded from backend).
 * Maps to Ionicons names for consistent rendering across the app.
 */
export const COLLECTION_ICON_IDENTIFIERS = {
  'book-open': 'book-outline',
  code: 'code-slash-outline',
  briefcase: 'briefcase-outline',
  globe: 'globe-outline',
  'play-circle': 'play-circle-outline',
  lightbulb: 'bulb-outline',
  'file-text': 'document-text-outline',
  star: 'star-outline',
} as const satisfies Record<string, IoniconName>;

export type CollectionIconIdentifier = keyof typeof COLLECTION_ICON_IDENTIFIERS;

export type CollectionIconOption =
  | { kind: 'emoji'; value: string; label: string }
  | { kind: 'ionicon'; value: IoniconName; label: string };

export const COLLECTION_ICON_OPTIONS: CollectionIconOption[] = [
  { kind: 'emoji', value: '📁', label: 'Folder' },
  { kind: 'emoji', value: '📚', label: 'Books' },
  { kind: 'emoji', value: '💡', label: 'Ideas' },
  { kind: 'emoji', value: '⭐', label: 'Star' },
  { kind: 'emoji', value: '🎯', label: 'Goals' },
  { kind: 'emoji', value: '📝', label: 'Notes' },
  { kind: 'emoji', value: '🔖', label: 'Bookmark' },
  { kind: 'emoji', value: '💼', label: 'Work' },
  { kind: 'ionicon', value: 'logo-linkedin', label: 'LinkedIn' },
  { kind: 'ionicon', value: 'logo-twitter', label: 'Twitter' },
  { kind: 'ionicon', value: 'logo-github', label: 'GitHub' },
  { kind: 'ionicon', value: 'grid-outline', label: 'Notion' },
  { kind: 'ionicon', value: 'logo-youtube', label: 'YouTube' },
  { kind: 'ionicon', value: 'logo-slack', label: 'Slack' },
  { kind: 'ionicon', value: 'logo-discord', label: 'Discord' },
  { kind: 'ionicon', value: 'logo-google', label: 'Google' },
  { kind: 'ionicon', value: 'logo-reddit', label: 'Reddit' },
  { kind: 'ionicon', value: 'globe-outline', label: 'Web' },
];

export const DEFAULT_COLLECTION_ICON = COLLECTION_ICON_OPTIONS[0].value;

export const COLLECTION_ICONS = COLLECTION_ICON_OPTIONS.filter(
  (option): option is Extract<CollectionIconOption, { kind: 'emoji' }> => option.kind === 'emoji',
).map((option) => option.value);

export function isCollectionIconIdentifier(icon: string): icon is CollectionIconIdentifier {
  return icon in COLLECTION_ICON_IDENTIFIERS;
}

export function resolveCollectionIoniconName(icon?: string | null): IoniconName {
  const parsed = parseCollectionIcon(icon);
  if (parsed.kind === 'ionicon') {
    return parsed.value as IoniconName;
  }

  return 'folder-outline';
}

export function encodeCollectionIcon(option: CollectionIconOption): string {
  if (option.kind === 'emoji') {
    return option.value;
  }

  return `${IONICON_PREFIX}${option.value}`;
}

export function parseCollectionIcon(icon?: string | null): {
  kind: 'emoji' | 'ionicon';
  value: string;
} {
  if (!icon) {
    return { kind: 'emoji', value: DEFAULT_COLLECTION_ICON };
  }

  if (icon.startsWith(IONICON_PREFIX)) {
    return { kind: 'ionicon', value: icon.slice(IONICON_PREFIX.length) };
  }

  if (isCollectionIconIdentifier(icon)) {
    return { kind: 'ionicon', value: COLLECTION_ICON_IDENTIFIERS[icon] };
  }

  return { kind: 'emoji', value: icon };
}

export function getCollectionIconLabel(icon?: string | null): string {
  const encoded = icon ?? DEFAULT_COLLECTION_ICON;

  if (isCollectionIconIdentifier(encoded)) {
    const label = encoded
      .split('-')
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join(' ');
    return label;
  }

  const match = COLLECTION_ICON_OPTIONS.find((option) => encodeCollectionIcon(option) === encoded);
  return match?.label ?? 'Collection';
}
