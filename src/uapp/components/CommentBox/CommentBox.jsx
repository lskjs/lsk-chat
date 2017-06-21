import React, { Component } from 'react';
import PropTypes from 'prop-types';
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

  static propTypes = {
    user: PropTypes.object,
    nested: PropTypes.oneOfType([PropTypes.bool, PropTypes.number]),
    nestedMargin: PropTypes.number,
    getChildren: PropTypes.func, // null parameter means get root level comments
    canWrite: PropTypes.bool,
    className: PropTypes.string,
    style: PropTypes.object,
  }

  static defaultProps = {
    nestedMargin: 20,
    canWrite: false,
  }

  getChildrenComments(comment = null) {
    const { comments } = this.props;
    return comments.filter(c => !comment || c.replyId == comment._id) || [];
  }

  @autobind
  renderComment(comment, level = 0, parent = null) {
    const { user, nested, nestedMargin } = this.props;

    let maxLevel;
    if (nested === true) {
      maxLevel = Number.MAX_VALUE;
    } else {
      maxLevel = +this.props.nested || 0;
    }

    const marginLeft = level > maxLevel ? 0 : nestedMargin * level;

    const htmlId = `comment_${comment._id}`;

    const getChildren = this.props.getChildren ? this.props.getChildren : this.getChildrenComments;

    return (
      <div key={comment._id} style={{ marginLeft }} id={htmlId}>
        <Comment user={comment.user}>
          <Comment.Header userName={comment.user.name}>

            <If condition={comment.replyId && parent}>
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
        {
            getChildren(comment).map(
              child => this.renderComment(child, level + 1, comment),
            )
          }
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
    const { className, style } = this.props;
    const getChildren = this.props.getChildren ? this.props.getChildren : this.getChildrenComments;
    const boxStyle = Object.assign({ background: '#fff', padding: '10 20' }, style);

    return (
      <div className={className} style={boxStyle}>
        {getChildren().map(cc => this.renderComment(cc, 0))}}
        {this.renderReplyForm()}
      </div>
    );
  }
}
