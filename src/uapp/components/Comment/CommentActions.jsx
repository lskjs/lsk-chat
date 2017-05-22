import React from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';
import importcss from 'importcss';
import styles from './Comment.css';

@importcss(styles)
class CommentActions extends React.Component {
  static propTypes = {
  }

  static defaultProps = {
  }

  render() {
    const { className, children, ...props } = this.props;

    return (
      <div
          {...props}
          styleName={cn(className, 'comment__actions')}
        >
        {children}
      </div>
    );
  }
}

export default CommentActions;
