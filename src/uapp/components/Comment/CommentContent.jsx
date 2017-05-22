import React from 'react';
import PropTypes from 'prop-types';
import InnerHtml from 'lsk-general/General/InnerHtml';
import cn from 'classnames';
import importcss from 'importcss';
import styles from './Comment.css';

@importcss(styles)
class CommentContent extends React.Component {
  static propTypes = {
    md: PropTypes.bool,
    html: PropTypes.bool,
  }

  static defaultProps = {
  }

  renderContent() {
    const { children, md } = this.props;
    return <InnerHtml type={md ? 'md' : 'text'} children={children} />;
  }

  render() {
    const { className } = this.props;
    return (
      <div
        styleName={cn(className, 'comment__content')}
      >
        {this.renderContent()}
      </div>
    );
  }
}

export default CommentContent;
