import type { RecentDocumentItem } from '../../../api/types';
import { CompactDocumentCard } from '../../../components/ui/CompactDocumentCard';

interface RecentDocumentListItemProps {
  document: RecentDocumentItem;
  onPress?: () => void;
}

export function RecentDocumentListItem({ document, onPress }: RecentDocumentListItemProps) {
  return <CompactDocumentCard document={document} onPress={onPress} />;
}
