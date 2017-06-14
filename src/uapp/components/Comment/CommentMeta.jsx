import React from 'react';
import PropTypes from 'prop-types';
import TimeAgo from 'react-timeago';
import cn from 'classnames';
import importcss from 'importcss';
import CommentActions from './CommentActions';
import styles from './Comment.css';

const MAX_HOURS_AGO = 6;

var monthNames = ["January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

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
    let jsDate = new Date(date);
    if (unit == "second")
      return "Just now";
    else if (unit == "year") {
        return jsDate.getDate() + " " + jsDate.getMonth() + " " + jsDate.getYear();
    }
    else if (unit == "minute" || unit == "hour" && value <= MAX_HOURS_AGO) {
      return defaultFormatter(value, unit, suffix, date);
    }
    else {
      return jsDate.getDate() + " " + monthNames[jsDate.getMonth()];
    }
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
        <CommentActions leftAligned>
          {userName && <span>{userName}</span>}
          {timeAgo && timeAgoLink}
        </CommentActions>
        {children}
      </div>
    );
  }
}

export default CommentMeta;
