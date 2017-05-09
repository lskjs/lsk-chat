import React, {Component} from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';
import importcss from 'importcss';
import styles from './Comment.css';

import Avatar from 'lsk-general/General/Avatar';
import Meta from './CommentMeta';
import Content from './CommentContent'
import Actions from './CommentActions';

@importcss(styles)
class Comment extends Component {
  static propTypes = {
    user: PropTypes.object,
  };

  static defaultProps = {
  };

  render() {
    const {
      user,
      className,
      children
    } = this.props;

    return (
      <section styleName="comment">
        <div styleName="comment__avatar-container">
          <div  styleName="comment__avatar">
            {user && <a href={user.href}><Avatar name={user.name} src={user.avatar} size={40}/></a>}
          </div>
        </div>
        <div styleName="comment__body">
          {children}
        </div>
      </section>
    );
  }
}

Comment.Header = Meta;
Comment.Content = Content;
Comment.Footer = Meta;
Comment.Actions = Actions;
export default Comment
/* <div styleName="comment__content">
  <div styleName="comment__author">{user.name}</div>
  <div styleName="comment__actions">


  </div>

  <div styleName="comment__text"></div>
  <footer styleName="comment__footer">
      <div styleName="comment__meta">

      </div>
    <div styleName="comment__footer-actions">

    </div>
  </footer>
</div>}*/
