export default function () {
  return {
    Messages: require('./Messages').default,//(...arguments),
    CommentBox: require('./CommentBox').default,//(...arguments),
  };
}
