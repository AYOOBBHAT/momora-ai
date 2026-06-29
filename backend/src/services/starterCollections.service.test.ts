import { beforeEach, describe, expect, it, vi } from 'vitest';
import mongoose from 'mongoose';

vi.mock('@/models/User.model', () => ({
  User: {
    findById: vi.fn(),
  },
}));

vi.mock('@/models/Collection.model', () => ({
  CollectionModel: {
    countDocuments: vi.fn(),
    insertMany: vi.fn(),
  },
}));

import { User } from '@/models/User.model';
import { CollectionModel } from '@/models/Collection.model';
import { STARTER_COLLECTION_DEFINITIONS } from '@/config/starterCollections';
import { seedStarterCollectionsForNewUser } from '@/services/starterCollections.service';

describe('starterCollections.service', () => {
  const userId = new mongoose.Types.ObjectId();

  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(mongoose, 'startSession').mockResolvedValue({
      withTransaction: async (fn: () => Promise<void>) => fn(),
      endSession: vi.fn(),
    } as never);
  });

  it('creates starter collections for new users', async () => {
    const save = vi.fn().mockResolvedValue(undefined);
    vi.mocked(User.findById).mockReturnValue({
      session: vi.fn().mockResolvedValue({
        _id: userId,
        starterCollectionsSeeded: false,
        save,
      }),
    } as never);
    vi.mocked(CollectionModel.countDocuments).mockReturnValue({
      session: vi.fn().mockResolvedValue(0),
    } as never);
    vi.mocked(CollectionModel.insertMany).mockResolvedValue([] as never);

    await seedStarterCollectionsForNewUser(userId);

    expect(CollectionModel.insertMany).toHaveBeenCalledWith(
      expect.arrayContaining([
        expect.objectContaining({
          name: STARTER_COLLECTION_DEFINITIONS[0].name,
          icon: 'book-open',
          sortOrder: 1,
        }),
      ]),
      expect.objectContaining({ session: expect.anything() }),
    );
    expect(save).toHaveBeenCalled();
  });

  it('skips seeding when already seeded', async () => {
    vi.mocked(User.findById).mockReturnValue({
      session: vi.fn().mockResolvedValue({
        _id: userId,
        starterCollectionsSeeded: true,
        save: vi.fn(),
      }),
    } as never);

    await seedStarterCollectionsForNewUser(userId);

    expect(CollectionModel.insertMany).not.toHaveBeenCalled();
  });
});
