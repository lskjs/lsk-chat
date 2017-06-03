import UniversalSchema from 'lego-starter-kit/utils/UniversalSchema';
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
    const { Message } = module.models;

    const message = await Message.findOne({
      subjectType: 'Chat',
      subjectId: obj._id,
    })
    await this.populate(obj, ['users', 'owner']);
    return {
      ...obj.toObject(),
      message: message ? message : await Message.findOne({})
    }
  };
  schema.statics.prepare = function (obj) {
    if (Array.isArray(obj)) {
      return Promise.map(obj, o => this.prepareOne(o));
    } else {
      return this.prepareOne(obj)
    }
  };

  //
  // schema.statics.prepare = function (obj) {
  //   return this.populate(obj, [
  //     'users', 'owner',
  //   ]);
  // };
  return schema;
}

export default(ctx, module) => {
  return getSchema(ctx, module).getMongooseModel(ctx.db);
};
