import mongoose, { Types } from 'mongoose';

import { STARTER_COLLECTION_DEFINITIONS } from '@/config/starterCollections';
import { CollectionModel } from '@/models/Collection.model';
import { User } from '@/models/User.model';

export async function seedStarterCollectionsForNewUser(userId: Types.ObjectId | string): Promise<void> {
  const session = await mongoose.startSession();

  try {
    await session.withTransaction(async () => {
      const user = await User.findById(userId).session(session);
      if (!user || user.starterCollectionsSeeded) {
        return;
      }

      const existingCount = await CollectionModel.countDocuments({ userId: user._id }).session(
        session,
      );

      if (existingCount > 0) {
        user.starterCollectionsSeeded = true;
        await user.save({ session });
        return;
      }

      await CollectionModel.insertMany(
        STARTER_COLLECTION_DEFINITIONS.map((definition) => ({
          userId: user._id,
          name: definition.name,
          description: definition.description,
          color: definition.color,
          icon: definition.icon,
          sortOrder: definition.sortOrder,
        })),
        { session },
      );

      user.starterCollectionsSeeded = true;
      await user.save({ session });
    });
  } finally {
    await session.endSession();
  }
}
