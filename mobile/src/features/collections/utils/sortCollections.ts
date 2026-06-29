import type { SafeCollection } from '../../../api/types';

export function sortCollectionsForDisplay(collections: SafeCollection[]): SafeCollection[] {
  const starterCollections = collections.filter((collection) => collection.sortOrder != null);
  const userCollections = collections.filter((collection) => collection.sortOrder == null);

  starterCollections.sort((left, right) => (left.sortOrder ?? 0) - (right.sortOrder ?? 0));
  userCollections.sort(
    (left, right) => new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime(),
  );

  return [...starterCollections, ...userCollections];
}

export function hasStarterCollections(collections: SafeCollection[]): boolean {
  return collections.some((collection) => collection.sortOrder != null);
}
