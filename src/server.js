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
      const { Chat, Message } = this.models;
      api.all('/myList', async (req) => {
        let chats = await Chat.find({
          // subjectType: params.subjectType,
          // subjectId: params.subjectId,
        });

        chats = await Chat.prepare(chats);
        chats = _.sortBy(chats, 'message.createdAt').reverse();

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
      api.post('/private/:userId', isAuth, async (req) => {
        const myUserId = req.user._id;
        const { userId } = req.params;
        const { content } = req.data;
        if (!myUserId) throw '!myUserId';
        // const { Chat } = this.models;
        let chat; //= Chat.findOne({});

        if (!chat) {
          chat = await Chat.create({
            ownerId: userId,
            userIds: [
              myUserId, userId,
            ],
            type: 'private',
          });
        }

        const data = {
          subjectId: chat._id,
          subjectType: 'Chat',
          userId: myUserId,
          user: myUserId, // todo
          content,
        };

        const message = Message.create(data);

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
        console.log(".post('/message'", req.data);
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
      messageRes.list = async () => {
        const messages = await Message.find({
          // subjectType: params.subjectType,
          // subjectId: params.subjectId,
        })
        .sort({createdAt: -1});

        return Message.prepare(messages);
        return chats2.map((chat) => {
          return {
            ...chat.toObject(),
            message: message.toObject(),
            // users: [123123, 12312312]
          };
        });
        return chats;
        //
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
