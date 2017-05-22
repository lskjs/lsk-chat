import React from 'react'; //eslint-disable-line
import ReplyForm from './ReplyForm';

const user = {
  _id: '12345',
  href: '/user/12345',
  name: 'Александр Пушкин',
  avatar: 'http://um.mos.ru/upload/resize_cache/iblock/11f/300_300_2/%D0%9F%D1%83%D1%88%D0%BA%D0%B8%D0%BD_%D0%A2%D1%80%D0%BE%D0%BF%D0%B8%D0%BD%D0%B8%D0%BD.jpg',
};

module.exports = function ({ storiesOf, action }) {
  return storiesOf('ReplyForm', module)
    .add('default', () => (
      <ReplyForm user={user}/>
    ))
    .add('custom texts', () => (
      <ReplyForm user={user} placeholder="Напишите что-нибудь" sendBtnText="Отправить" cancelBtnText="Отмена"/>
    ))
};
