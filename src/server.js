import _ from 'lodash';
import { autobind } from 'core-decorators';

export default (ctx) => {
  return class LskChat {

    async init() {
      this.models = require('./server/models').default(ctx, this);
    }
    async run() {
      ctx.app.use('/api/module/chat', this.getApi());
      this.ws = ctx.app.ws('/api/module/chat/message')
        .on('connection', this.onSocket);
    }

    getApi() {
      const api = ctx.asyncRouter();
      const { isAuth } = ctx.middlewares;
      const { createResourse, wrapResourse, wrapResoursePoint } = ctx.helpers;
      const { User } = ctx.models;
      const { Chat, Message } = this.models;
      // api.all('/fix', async (req) => {
      //   const myUserId = req.user._id;
      //   const users = await User.find({
      //
      //   });
      //   const i = 0;
      //   return Promise.mapSeries(users, (user1) => {
      //     return Promise.mapSeries(users, async (user2) => {
      //       if ((i == 0 && user1._id != user2._id)) {
      //         // i++;
      //
      //         const userIds = [user1._id, user2._id];
      //         console.log({ userIds });
      //         let chat = await Chat.findOne({
      //           type: 'private',
      //           userIds: { $all: userIds },
      //         });
      //
      //         if (chat) return true;
      //         if (Math.random() > 0.9) return false;
      //
      //
      //         if (!chat) {
      //           // throw e(404, '!chat');
      //           chat = await Chat.create({
      //             type: 'private',
      //             ownerId: userIds[0],
      //             userIds,
      //           });
      //         }
      //         return 'chat';
      //       }
      //       return null;
      //     });
      //   });
      //   // .populate('user'); // order populate sort
      // });
      //
      api.all('/setView', isAuth, async (req) => {
        // console.log('setView@@@');
        const myUserId = req.user._id;
        const chatId = req.data.chatId;
        const chat = await Chat.findById(chatId);
        if (!chat) throw 'can\'t find chat';
        if (chat.userIds.filter(userId => userId.toString() === myUserId)) {
          if (!chat.usersViewedAt) {
            chat.usersViewedAt = {};
          }

          // console.log('before', chat.usersViewedAt[myUserId]);
          chat.usersViewedAt[myUserId] = new Date();
          // console.log('after', chat.usersViewedAt[myUserId]);
          chat.markModified('usersViewedAt');
        }
        // console.log('after-after1231231', chat.usersViewedAt[myUserId]);
        await chat.save();
        // console.log('after-after', chat.usersViewedAt[myUserId]);
        return chat
        // .populate('user'); // order populate sort
      });
      api.all('/myList', isAuth, async (req) => {
        const myUserId = req.user._id;
        let chats = await Chat.find({
          type: 'private',
          userIds: { $all: [myUserId] },
        });
        // console.log({chats});
        chats = await Chat.prepare(chats);
        chats = chats.filter(c => c.message != null);
        chats = _.sortBy(chats, 'message.createdAt').reverse();
        // console.log({ qwedasda: chats[0] });
        return chats;
        // .populate('user'); // order populate sort
      });
      api.get('/message/:subjectType/:subjectId', async (req) => {
        const params = req.allParams();
        return Message.find({
          subjectType: params.subjectType,
          subjectId: params.subjectId,
        })
        .populate('user'); // order populate sort
      });
      api.get('/private/:userId', isAuth, async (req) => {
        const myUserId = req.user._id;
        const { userId } = req.params;
        const { content } = req.data;
        if (!myUserId) throw '!myUserId';
        const userIds = [
          myUserId, userId,
        ];

        let chat = await Chat.findOne({
          type: 'private',
          userIds: { $all: userIds },
        });


        if (!chat) {
          chat = await Chat.create({
            type: 'private',
            ownerId: myUserId,
            userIds,
          });
        }
        return Chat.prepare(chat);
      });
      api.post('/private/:userId', isAuth, async (req) => {
        const myUserId = req.user._id;
        const { userId } = req.params;
        const { content } = req.data;
        if (!myUserId) throw '!myUserId';
        const userIds = [
          myUserId, userId,
        ];

        let chat = await Chat.findOne({
          type: 'private',
          userIds: { $all: userIds },
        });

        if (!chat) {
          chat = await Chat.create({
            ownerId: userId,
            type: 'private',
            userIds,
          });
        }

        const data = {
          subjectId: chat._id,
          subjectType: 'Chat',
          userId: myUserId,
          user: myUserId, // todo
          content,
        };

        let message = await Message.create(data);
        message = await Message.prepare(message);

        this.emit(
          this.getRoomName(data.subjectType, data.subjectId),
          message,
        );
        // console.log(this.ws, 'this.ws');
        // this.emit(
        //   this.getRoomName(params.subjectType, params.subjectId),
        //   await Message.populate(message, 'user'),
        // );
        return {
          __pack: 1,
          chat,
          message,
        };
      });
      api.post('/message', isAuth, async (req) => {
        console.log(".post('/message'", req.data, req.user);
        const params = req.allParams();
        const userId = req.user._id;
        params.user = userId;
        const message = new Message(params);
        await message.save();
        // console.log(this.ws, 'this.ws');
        this.emit(
          this.getRoomName(params.subjectType, params.subjectId),
          await Message.populate(message, 'user'),
        );
        return message;
      });
      api.put('/message/:id', isAuth, async (req) => {
        const params = req.allParams();
        const comment = await Message
        .findById(params.id)
        .then(ctx.helpers._checkNotFound('Comment'));
        // check owner
        // validate params
        // Message.setState(params)
        Object.assign(comment, params);
        return comment.save();
      }); // Изменить комментарий
      api.delete('/message/:id', isAuth, async (req) => {
        const params = req.allParams();
        const comment = await Message
        .findById(params.id)
        .then(ctx.helpers._checkNotFound('Comment'));
        // check owner
        return comment.remove();
      }); // Изменить комментарий
      api.use('/', wrapResoursePoint(createResourse(Chat)));
      const messageRes = createResourse(Message);
      messageRes.list = async (req) => {
        const params = {
          sort: {
            createdAt: -1,
          },
          ...req.data,
        };

        const messages = await Message.findByParams(params);
        return Message.prepare(messages);
      };
      api.use('/message', wrapResoursePoint(messageRes));
      // api.use('/chat', wrapResoursePoint(createResourse(Messag)));
      // api.use('/message', wrapResourse(createResourse(Message)));
      return api;
    }

    getRoomName(subjectType, subjectId) {
      return `subject_${subjectType}_subjectId_${subjectId}`;
    }

    emit(room, message, emitAction = 'message') {
      // console.log(`Шлю в комнату ${room} сообщение ${message.content}`);
      return this.ws.to(room).emit(emitAction, message);
    }

    @autobind
    onSocket(socket) {
      // console.log('socket connected');
      const { req } = socket;
      const { Message } = this.models;
      if (!req.user || !req.user._id) throw new Error('Not Auth');

      const { subjectType, subjectId } = req.data;
      const roomName = this.getRoomName(subjectType, subjectId);
      socket.join(`user_${req.user.id}`);
      socket.join(roomName);
      socket.on('message', async (data) => {
        // console.log('socket.on message', data);
        const message = new Message({
          ...data,
          subjectType,
          subjectId,
          user: socket.user._id,
        });
        await message.save();
        await Message.populate(message, 'user');
        return this.emit(roomName, message);
      });
    }
  };
};
