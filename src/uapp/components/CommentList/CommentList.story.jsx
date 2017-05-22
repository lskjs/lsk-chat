import React from 'react'; //eslint-disable-line
import Comment from '../Comment';
import CommentList from './CommentList';
import ClearIcon from 'react-icons/lib/md/clear';
import FavoriteIcon from 'react-icons/lib/md/favorite-outline';
import EditIcon from 'react-icons/lib/md/edit';
import AddIcon from 'react-icons/lib/md/add-circle-outline';

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

const now = new Date();

const comments = [
  { id : 1, user : user1, content : "Привет, Никита!", date : new Date(now.setSeconds(now.getSeconds() + 0))},
  { id : 2, user : user2, content : "Привет, Санек!", date : new Date(now.setSeconds(now.getSeconds() + 10)) },
  { id : 3, user : user1, content : "Как дела?", date : new Date(now.setSeconds(now.getSeconds() + 20)) },
  { id : 4, user : user2, content : "Ничего, книги пишу", date : new Date(now.setSeconds(now.getSeconds() + 30)) },
  { id : 5, user : user1, content : "Скучный ты", date : new Date(now.setSeconds(now.getSeconds() + 40)) },
];

function commentRenderer(comment) {
  return (<Comment key={comment.id} user={comment.user}>
    <Comment.Header userName={comment.user.name}>
      <Comment.Actions><ClearIcon onClick={() => console.log("Delete clicked")}/></Comment.Actions>
    </Comment.Header>
    <Comment.Content>{comment.content}</Comment.Content>
    <Comment.Footer date={comment.date}>
      <Comment.Actions><FavoriteIcon onClick={() => console.log("Like clicked")}/></Comment.Actions>
    </Comment.Footer>
  </Comment>)
}

module.exports = function ({ storiesOf, action }) {
  return storiesOf('CommentList', module)
    .add('default', () => (
      <CommentList comments={comments} />
    ))
    .add('using comment renderer', () => (
      <CommentList comments={comments} commentRenderer={commentRenderer} />
    ))
};
