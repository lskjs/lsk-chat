import React, { Component, PropTypes } from 'react';
import Textarea from 'react-textarea-autosize';
import AddIcon from 'react-icons/lib/md/add-circle-outline';
import Avatar from 'lsk-general/General/Avatar';
import cn from 'classnames';
import importcss from 'importcss';
import styles from './ReplyForm.css';

@importcss(styles)
class ReplyForm extends Component {
  static propTypes = {
    user: PropTypes.object,
    placeholder: PropTypes.string,
    sendBtnText: PropTypes.string,
    cancelBtnText: PropTypes.string,
    onSend: PropTypes.func,
    onCancel : PropTypes.func
  };
  static defaultProps = {
    placeholder: "Write here...",
    sendBtnText: "Send",
    cancelBtnText : "Cancel",
    onSend : () => {},
    onCancel : () => {}
  };

  render() {
    const {
      user,
      placeholder,
      sendBtnText,
      cancelBtnText,
      onSend,
      onCancel
    } = this.props;

    return (
      <section styleName="reply-form">
        <div>
        {user && <a href={user.href}><Avatar name={user.name} src={user.src} size={40}/></a>}
        </div>
        <div styleName="reply-form__body">
          <Textarea rows={3} placeholder={placeholder}></Textarea>
          <footer styleName="reply-form__footer">
            <div styleName="reply-form__add-attachment">
              <button styleName="reply-form__icon-btn"><AddIcon size="20px" color="#828282"/></button>
            </div>
            <div styleName="reply-form__actions">
              <button styleName="reply-form__btn" onClick={onCancel}>{cancelBtnText}</button>
              <button styleName="reply-form__btn" onClick={onSend}>{sendBtnText}</button>
            </div>
          </footer>
        </div>
      </section>
    );
  }
}

export default ReplyForm;
