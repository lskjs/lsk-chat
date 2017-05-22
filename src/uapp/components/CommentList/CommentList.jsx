import React from 'react';
import PropTypes from 'prop-types';
import Comment from '../Comment';
import cn from 'classnames';
import importcss from 'importcss';
import styles from './CommentList.css';

@importcss(styles)
class CommentList extends React.Component {
  static propTypes = {
    comments : PropTypes.array.isRequired,
    commentRenderer : PropTypes.func
  }

  static defaultProps = {
    comments : []
  }

  commentRenderer = (comment) => {
    return (
      <Comment key={comment.id} user={comment.user}>
        <Comment.Header userName={comment.user.name} />
        <Comment.Content>{comment.content}</Comment.Content>
        <Comment.Footer date={comment.date} />
      </Comment>
    )
  }

  render() {
    const { className, comments, commentRenderer, ...props } = this.props;
    const renderer = commentRenderer || this.commentRenderer;
    return (
      <section>
        <div>
          Панель
        </div>
        {comments.map((c, i) => renderer(c))}
      </section>
    );
  }
}

export default CommentList;
