import React from 'react'; //eslint-disable-line
import ReplyForm from '../ReplyForm';
import CommentList from '../CommentList';
import CommentBox from './CommentBox';
const user1 = {
  _id: '12345',
  href: '/user/12345',
  name: 'Александр Пушкин',
  avatar: 'http://um.mos.ru/upload/resize_cache/iblock/11f/300_300_2/%D0%9F%D1%83%D1%88%D0%BA%D0%B8%D0%BD_%D0%A2%D1%80%D0%BE%D0%BF%D0%B8%D0%BD%D0%B8%D0%BD.jpg',
};

const user2 = {
  _id: '12346',
  href: '/user/12346',
  name: 'Никита Михалков',
  avatar: 'http://um.mos.ru/upload/resize_cache/iblock/11f/300_300_2/%D0%9F%D1%83%D1%88%D0%BA%D0%B8%D0%BD_%D0%A2%D1%80%D0%BE%D0%BF%D0%B8%D0%BD%D0%B8%D0%BD.jpg',
};

const user3 = {
  _id: '12347',
  href: '/user/12347',
  name: 'Ваня Иванов',
  avatar: 'http://um.mos.ru/upload/resize_cache/iblock/11f/300_300_2/%D0%9F%D1%83%D1%88%D0%BA%D0%B8%D0%BD_%D0%A2%D1%80%D0%BE%D0%BF%D0%B8%D0%BD%D0%B8%D0%BD.jpg',
};


const now = new Date();

const comments = [
  { _id: 1, user: user1, content: 'Привет, Никита!', date: new Date(now.setSeconds(now.getSeconds() - 1000000)) },
  { _id: 2, user: user2, content: 'Привет, Санек!', date: new Date(now.setSeconds(now.getSeconds() + 10)) },
  { _id: 3, user: user1, content: 'Как дела?', date: new Date(now.setSeconds(now.getSeconds() + 20)) },
  { _id: 4, user: user2, content: 'Ничего, книги пишу', date: new Date(now.setSeconds(now.getSeconds() + 30)) },
  { _id: 5, user: user1, content: 'Скучный ты', date: new Date(now.setSeconds(now.getSeconds() + 40)) },
];

const nestedComments = [
  { _id: 1, user: user1, content: 'Привет, Никита!', date: new Date(now.setSeconds(now.getSeconds() + 0)) },
  { _id: 2, user: user2, content: 'Привет, Санек!', date: new Date(now.setSeconds(now.getSeconds() + 10)) },
  { _id: 3,
    user: user1,
    content: 'Как дела?',
    date: new Date(now.setSeconds(now.getSeconds() + 20)),
    children: [
      { _id: 7, user: user3, content: 'Я тут дочерний коммент написал', date: new Date(now.setSeconds(now.getSeconds() + 55)) },
      { _id: 8, user: user3, content: 'Я молодец', date: new Date(now.setSeconds(now.getSeconds() + 56)) },
      {
        _id: 9,
        user: user3,
        content: '!!!',
        date: new Date(now.setSeconds(now.getSeconds() + 100000)),
        children: [
          { _id: 17, user: user3, content: 'Я тут ещё более дочерний коммент написал', date: new Date(now.setSeconds(now.getSeconds() + 55)) },
          { _id: 18, user: user3, content: 'Я молодец дважды', date: new Date(now.setSeconds(now.getSeconds() + 56)) },
          { _id: 19, user: user3, content: '!!!', date: new Date(now.setSeconds(now.getSeconds() + 100000)),
            children : [
              { _id: 20, user: user3, content: 'Вот это комментарий большой глубины', date: new Date(now.setSeconds(now.getSeconds() + 100500)) }
            ]
          },
        ],
      },
    ],
  },
  { _id: 4, user: user2, content: 'Ничего, книги пишу', date: new Date(now.setSeconds(now.getSeconds() + 30)) },
  { _id: 5, user: user1, content: 'Скучный ты', date: new Date(now.setSeconds(now.getSeconds() + 40)) },
];

const nestedComments2 = [
  { _id: 1, user: user1, content: 'Привет, Никита!', date: new Date(now.setSeconds(now.getSeconds() + 0)) },
  { _id: 2, user: user2, content: 'Привет, Санек!', date: new Date(now.setSeconds(now.getSeconds() + 10)) },
  { _id: 3, user: user1, content: 'Как дела?', date: new Date(now.setSeconds(now.getSeconds() + 10)) },
  { _id: 4, user: user2, content: 'Ничего, книги пишу', date: new Date(now.setSeconds(now.getSeconds() + 30)) },
  { _id: 5, user: user1, content: 'Скучный ты', date: new Date(now.setSeconds(now.getSeconds() + 40)) },
  { _id: 7, user: user3, replyId: 3, content: 'Я тут дочерний коммент написал', date: new Date(now.setSeconds(now.getSeconds() + 55)) },
  { _id: 8, user: user3, replyId: 7, content: 'Я молодец', date: new Date(now.setSeconds(now.getSeconds() + 56)) },
  { _id: 9, user: user3, replyId: 8, content: '!!!', date: new Date(now.setSeconds(now.getSeconds() + 100)) },
  { _id: 10, user: user1, replyId: 3, content: 'Привет, привет!', date: new Date(now.setSeconds(now.getSeconds() + 12335)) },
  { _id: 11, user: user1, replyId: 10, content: 'Привет и пока!', date: new Date(now.setSeconds(now.getSeconds() + 123)) },
  { _id: 12, user: user3, replyId: 11, content: 'Вот это комментарий большой глубины', date: new Date(now.setSeconds(now.getSeconds() + 100500)) }
];


module.exports = function ({ storiesOf, action }) {
  return storiesOf('CommentBox', module)
    .add('default', () => (
      <CommentBox
        user={user1}
        canWrite
        comments={comments}
      />
    ))
    .add('nested=0', () => (
      <CommentBox
        user={user1}
        comments={nestedComments}
      />
    ))
    .add('nested=2', () => (
      <CommentBox
        user={user1}
        canWrite
        nested={2}
        comments={nestedComments}
      />
    ))
    .add('smart nested comments ', () => (
      <CommentBox
        user={user1}
        nested={0}
        canWrite
        comments={nestedComments2}
      />
    ))
    .add('smart nested comments 2', () => (
      <CommentBox
        user={user3}
        nested={2}
        comments={nestedComments2}
      />
    ));
};
