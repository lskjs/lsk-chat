import UniversalSchema from 'lego-starter-kit/utils/UniversalSchema';
export function getSchema(ctx) {
  const mongoose = ctx.db;
  const schema = new UniversalSchema({
    subjectId: {
      type: String,
      index: true,
    },
    subjectType: {
      type: String,
      default: 'Chat',
      index: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      index: true,
    },
    content: {
      type: Object,
      default: null,
    },
    attachments: {
      type: [Object],
      default: null,
    },
    read: {
      type: Boolean,
      default: false,
    },
  }, {
    collection: 'chat_message',
    timestamps: true,
  });

  schema.post('save', function () {
    if (this.subjectType === 'User') {
      ctx.modules.notification.notify({
        subjectId: this._id,
        subjectType: 'Message',
        objectId: this.user,
        objectType: 'User',
        action: 'message',
        userId: this.subjectId,
      });
    }
    if (this.subjectType === 'Chat') {
      console.log("notify this.subjectType === 'Chat'");
    }
  });

  return schema;
}


export default(ctx) => {
  return getSchema(ctx).getMongooseModel(ctx.db);
};
