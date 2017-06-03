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
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      index: true,
    },
    // user: {
    //   type: mongoose.Schema.Types.ObjectId,
    //   ref: 'User',
    //   index: true,
    // },
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


  // schema.virtual('user', {
  //   ref: 'User', // The model to use
  //   localField: 'userId', // Find people where `localField`
  //   foreignField: '_id', // is equal to `foreignField`,
  //   justOne: true,
  // });
  schema.statics.prepareOne = async function (obj) {
    // const message = await module.models.Message.findOne({
    //   // subjectType: params.subjectType,
    //   // subjectId: params.subjectId,
    // })
    // // const deals = await module.models.Deal.find({
    // //   offerId: obj._id
    // // }).populate('user')
    // obj.message = message;
    //
    //
    //
    //
    // const {User} = ctx.models.Message;
    // constUser.findById(obj.userId)

    // return obj;
    return this.populate(obj, ['user']);
    // return this.populate(['deal', 'user']);
  };
  schema.statics.prepare = function (obj) {
    if (Array.isArray(obj)) {
      return Promise.map(obj, o => this.prepareOne(o));
    } else {
      return this.prepareOne(obj)
    }
  };


  schema.virtual('user', {
    ref: 'User', // The model to use
    localField: 'userId', // Find people where `localField`
    foreignField: '_id', // is equal to `foreignField`,
    justOne: true,
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
