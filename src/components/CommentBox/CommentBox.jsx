import React, { Component } from 'react';
import { autobind } from 'core-decorators';
import Comment from '../Comment';
import ReplyForm from '../ReplyForm';

export default class CommentBox extends Component {

  @autobind
  renderComment(comment, index, level = 0) {
    const { user } = this.props;
    const maxLevel = +this.props.nested || 0;
    // const maxNestingLevel = 4;
    const marginLeft = 20 * Math.min(level, maxLevel);
    const htmlId = `comment_${comment._id}`;
    return (
      <div key={comment._id} style={{ marginLeft }} id={htmlId}>
        <Comment user={comment.user}>
          <Comment.Header userName={comment.user.name}>
            <If condition={comment.replyId}>
              <a href={`#comment_${comment.replyId}`}>
                ответил Игорю
              </a>
            </If>
          </Comment.Header>
          <Comment.Content>{comment.content}</Comment.Content>
          <Comment.Footer date={comment.date || comment.createdAt} dateHref={`/comments/${comment._id}`}>
            {/* <a href="#">
              Ответить
            </a>
            <If condition={user && comment.user && user._id === comment.user._id}>
              <a href="#">
                Редактировать
              </a>
            </If> */}
          </Comment.Footer>
        </Comment>
        {(comment.children || []).map((cc, ii) => this.renderComment(cc, ii, level + 1))}
      </div>
    );
  }

  render() {
    // return <div>sdffdhgfjgufywegb</div>
    const { comments, user, canWrite } = this.props;
    const commentsTree = comments || [];
    // Сортируем
    return (
      <div style={{ background: '#fff', padding: '10 20' }}>
        {commentsTree.map((comment, index) => this.renderComment(comment, index, 0))}
        {canWrite && user && <ReplyForm user={user} /> }
      </div>
    );
  }
}
