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
    const { className, children, leftAligned, ...props } = this.props;
    __DEV__ && console.log("LA: ", leftAligned);
    return (
      <div
          {...props}
          styleName={cn({ className, 'comment__actions' : true, 'comment__actions-left' : leftAligned })}
        >
        {children}
      </div>
    );
  }
}

export default CommentActions;
