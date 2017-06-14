import React, { Component } from 'react';
import { autobind } from 'core-decorators';
import Comment from '../Comment';
import ReplyForm from '../ReplyForm';
import FavoriteIcon from 'react-icons2/md/favorite-outline';
import ClearIcon from 'react-icons2/md/clear';
import EditIcon from 'react-icons2/md/edit';
import petrovich from 'petrovich';
import importcss from 'importcss';

function dative(user) { // TODO: перенести логику в user
  return petrovich.male.first.dative(user.name.split(' ')[0]);
}

export default class CommentBox extends Component {

  getChildrenComments(commentId = null) {
    const { comments } = this.props;
    return comments.filter(c => c.replyId == commentId) || [];
  }

  @autobind
  renderComment(comment, index, level = 0, parent) { // TODO: подумать, о том чтобы передавать объект
    const { user, nested } = this.props;

    let maxLevel;
    if (nested === true) {
      maxLevel = Number.MAX_VALUE;
    } else {
      maxLevel = +this.props.nested || 0;
    }
    const marginLeft = 20 * Math.min(level, maxLevel);
    // const marginLeft = level > maxLevel ? 0 : 20 * Math.min(level, maxLevel); // Алексей

    const htmlId = `comment_${comment._id}`;

    return (
      <div key={comment._id} style={{ marginLeft }} id={htmlId}>
        <Comment user={comment.user}>
          <Comment.Header userName={comment.user.name}>

            <If condition={comment.replyId}>
              <Comment.Actions leftAligned>
                <a className="reply-to" href={`#comment_${comment.replyId}`}>
                    ответил {dative(parent.user)}
                </a>
              </Comment.Actions>
            </If>

            <If condition={user && comment.user && user._id === comment.user._id}>
              <Comment.Actions>
                <EditIcon />
                <ClearIcon />
              </Comment.Actions>
            </If>
          </Comment.Header>
          <Comment.Content>{comment.content}</Comment.Content>
          <Comment.Footer date={comment.date || comment.createdAt} dateHref={`/comments/${comment._id}`}>
            <Comment.Actions leftAligned>
              <a href="#">
                Ответить
              </a>
            </Comment.Actions>
            <Comment.Actions>
              <FavoriteIcon />
            </Comment.Actions>
          </Comment.Footer>
        </Comment>
        <If condition={comment.children}>
          {comment.children}
        </If>
        <If condition={!comment.children}>
          {
            this.getChildrenComments(comment._id).map(
              (cc, ii) => (
                this.renderComment(cc, ii, level + 1, comment)
              ),
            )
          }
        </If>

      </div>
    );
  }

  renderReplyForm() {
    const { user, canWrite } = this.props;
    if (!canWrite || !user) return;
    return (
      <ReplyForm user={user} />
    );
  }

  render() {
    // Сортируем
    return (
      <div style={{ background: '#fff', padding: '10 20' }}>
        {this.getChildrenComments(null).map((cc, ii) => this.renderComment(cc, ii, 0))}}
        {this.renderReplyForm()}
      </div>
    );
  }
}
