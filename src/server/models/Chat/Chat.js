import UniversalSchema from 'lego-starter-kit/utils/UniversalSchema';
import find from 'lodash/find';

export function getSchema(ctx, module) {
  const mongoose = ctx.db;
  const schema = new UniversalSchema({
    type: {
      type: String,
      enum: ['me', 'private', 'group'],
      index: true,
    },
    userIds: {
      type: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
        },
      ],
      index: true,
    },
    usersViewedAt: {
      type: {},
      default: {},
    },
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      index: true,
    },
    status: {
      type: String,
    },
  }, {
    collection: 'chat_chat',
    timestamps: true,
  });


  schema.virtual('owner', {
    ref: 'User', // The model to use
    localField: 'ownerId', // Find people where `localField`
    foreignField: '_id', // is equal to `foreignField`,
    justOne: true,
  });

  schema.virtual('users', {
    ref: 'User', // The model to use
    localField: 'userIds', // Find people where `localField`
    foreignField: '_id', // is equal to `foreignField`,
  });

  schema.statics.prepareOne = async function (obj) {
    const { User } = ctx.models;
    const { Message } = module.models;

    // TODO: разобраться почему не работает populate
    // await obj
    //   .populate('owner')
    //   .populate('users');
    //

    // const userIds = [obj.ownerId, ...obj.userIds];
    const userIds = obj.userIds;
    const allUsers = await User.find({
      _id: { $in: userIds },
    });

    // const owner = find(allUsers, { _id: obj.ownerId });
    const users = obj.userIds.map(userId => find(allUsers, { _id: userId }));

    const message = await Message.findOne({
      subjectType: 'Chat',
      subjectId: obj._id,
    })
    .sort({ createdAt: -1 });


    return {
      ...obj.toObject(),
      // owner,
      users,
      message,
    };
  };

  return schema;
}

export default(ctx, module) => {
  return getSchema(ctx, module).getMongooseModel(ctx.db);
};
