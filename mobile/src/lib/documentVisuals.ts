import type { ComponentProps } from 'react';
import { Ionicons } from '@expo/vector-icons';

import type { DocumentSourceType } from '../api/types';

type IoniconName = ComponentProps<typeof Ionicons>['name'];

export interface DocumentVisual {
  icon: IoniconName;
  label: string;
  accent: string;
  background: string;
}

const VISUALS: Record<DocumentSourceType, DocumentVisual> = {
  pdf: {
    icon: 'document-text',
    label: 'PDF',
    accent: '#F87171',
    background: 'rgba(248, 113, 113, 0.15)',
  },
  url: {
    icon: 'globe-outline',
    label: 'Website',
    accent: '#38BDF8',
    background: 'rgba(56, 189, 248, 0.15)',
  },
  youtube: {
    icon: 'logo-youtube',
    label: 'YouTube',
    accent: '#EF4444',
    background: 'rgba(239, 68, 68, 0.15)',
  },
  text: {
    icon: 'reader-outline',
    label: 'Note',
    accent: '#A78BFA',
    background: 'rgba(167, 139, 250, 0.15)',
  },
  upload: {
    icon: 'cloud-upload-outline',
    label: 'Upload',
    accent: '#34D399',
    background: 'rgba(52, 211, 153, 0.15)',
  },
};

export function getDocumentVisual(sourceType: DocumentSourceType): DocumentVisual {
  return VISUALS[sourceType] ?? VISUALS.text;
}
