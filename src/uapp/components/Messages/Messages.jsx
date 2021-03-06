import React, { Component } from 'react';
import { inject } from 'mobx-react';
import get from 'lodash/get';
import {
  Card,
  CardBlock,
} from 'react-bootstrap-card';
import {
  FormControl,
} from 'react-bootstrap';
import Avatar from '@lskjs/general/Avatar';
import Loading from '@lskjs/general/Loading';
import CommentBox from '../CommentBox';

@inject('user', 'api')
export default class Chat extends Component {
  constructor() {
    super();
    this.state = {};
  }
  async componentDidMount() {
    const { subjectType, subjectId } = this.props;
    this.socket = this.props.api.ws('module/chat/message', {
      query: { subjectType, subjectId },
    });
    this.socket.on('message', async (message) => {
      // console.log('Пришло сообщение!', message);
      const { messages } = this.state;
      messages.push(message);
      this.setState({ messages });
    });
    // console.log(this.socket);
    const res = await this.getLastMessages();
    this.setState({ messages: res.data || [] });
  }
  componentWillUnmount() {
    this.socket && this.socket.disconnect();
  }

  async getLastMessages() {
    return this.props.api.fetch(`/api/module/chat/message/${this.props.subjectType}/${this.props.subjectId}`);
  }
  handleOnKeyPress() {
    return (e) => {
      const { key } = e;
      const { value } = e.target;
      if (key === 'Enter') {
        const { text } = this.state;
        if (!text || text.length === 0) return;
        // this.socket.emit('message', { content: text });
        this.props.api.fetch('/api/module/chat/message', {
          method: 'POST',
          body: {
            content: text,
            subjectType: this.props.subjectType,
            subjectId: this.props.subjectId,
          },
        });
        this.setState({ text: '' });
      }
    };
  }
  handleOnChange() {
    return (e) => {
      const { value } = e.target;
      this.setState({ text: value });
    };
  }
  render() {
    return (
      <div>
        <If condition={!this.state.messages}>
          <Loading />
        </If>
        <If condition={this.state.messages}>
          <CommentBox
            comments={this.state.messages.map(message => ({
              ...message,
              date: message.createdAt,
              user: {
                ...message.user,
                avatar: get(message, 'user.profile.avatar'),
              }
            }))}
            user={this.props.user}
            refForm={(form) => this.form = form}
          />
          {/* {this.state.messages.map(message => (
            <Card key={message._id}>
              <CardBlock>
                <Avatar
                  size={20}
                  src={get(message, 'user.profile.avatar')}
                  style={{
                    margin: '10px',
                  }}
                />
                {message.content}
              </CardBlock>
            </Card>
          ))} */}
          <Card>
            <CardBlock>
              <FormControl
                value={this.state.text}
                onKeyPress={this.handleOnKeyPress()}
                onChange={this.handleOnChange()}
              />
            </CardBlock>
          </Card>
        </If>
      </div>
    );
  }
}
