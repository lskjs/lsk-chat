import UniversalSchema from 'lego-starter-kit/utils/UniversalSchema';
export function getSchema(ctx, module) {
  const mongoose = ctx.db;
  const schema = new UniversalSchema({
    subjectId: {
      type: mongoose.Schema.Types.ObjectId,
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
      type: [
        //{
          // url: String,
        //}
      ],
      // type: [Object],
      default: [],
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
    }
    return this.prepareOne(obj);
  };


  schema.virtual('user', {
    ref: 'User', // The model to use
    localField: 'userId', // Find people where `localField`
    foreignField: '_id', // is equal to `foreignField`,
    justOne: true,
  });

  schema.post('save', async function () {
    if (ctx.modules.notification) {
      if (this.subjectType === 'User') {
        ctx.modules.notification.notify({
          subjectId: this._id,
          subjectType: 'Message',
          objectId: this.userId,
          objectType: 'User',
          action: 'message',
          userId: this.subjectId,
        });
      }
      if (this.subjectType === 'Chat') {
        const { Chat } = module.models;
        const chat = await Chat.findById(this.subjectId);
        chat.userIds && chat.userIds.forEach((userId) => {
          if ((this.userId && this.userId.toString()) === (userId.toString())) return;


          let content = this.content;
          if (this.attachments && this.attachments[0]) {
            switch (this.attachments[0].type) {
              case 'location':
                content = 'Местоположение';
                break;
              case 'image':
                content = 'Изображение';
                break;
            }
          }
          if (!content) content = 'Сообщение';
          const message = 'Новое сообщение:' +  content;
          // const message = user._id === message.userId ? `Вы: ${content}` : content;


          ctx.modules.notification.notify({
            message,
            subjectId: this.userId,
            subjectType: 'User',
            objectId: this.subjectId,
            objectType: 'Chat',
            action: 'message',
            info: {
              messageId: this._id,
              messageText: message,
            },
            userId,
          });
        });
      }
    }
  });

  return schema;
}


export default(ctx, module) => {
  return getSchema(ctx, module).getMongooseModel(ctx.db);
};
