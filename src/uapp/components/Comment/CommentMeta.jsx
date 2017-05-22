import React from 'react';
import PropTypes from 'prop-types';
import TimeAgo from 'react-timeago';
import cn from 'classnames';
import importcss from 'importcss';
import styles from './Comment.css';

@importcss(styles)
class CommentMeta extends React.Component {
  static propTypes = {
    userName : PropTypes.string,
    timeFormatter : PropTypes.func,
    date : PropTypes.instanceOf(Date),
    dateHref : PropTypes.string
  }

  static defaultProps = {

  }

  formatDate = (value, unit, suffix, date, defaultFormatter) => {
    if (unit == "second")
      return "Just now";
    else
      return defaultFormatter(value, unit, suffix, date);
  }

  render() {

    const { className, children, userName, date, dateHref, timeFormatter, ...props } = this.props;

    const timeagoFormat = timeFormatter || this.formatDate;

    const timeAgo = date && <TimeAgo date={date} formatter={timeagoFormat}/>;

    const timeAgoLink = dateHref && <a href={dateHref}>{timeAgo}</a> || timeAgo;

    return (
      <div
        {...props}
        styleName={cn(className, 'comment__meta')}
      >
        {userName && <span>{userName}</span>}
        {timeAgo && timeAgoLink}
        {children}
      </div>
    );
  }
}

export default CommentMeta;
