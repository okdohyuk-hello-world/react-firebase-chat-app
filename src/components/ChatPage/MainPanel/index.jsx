import React, { Component } from 'react';
import MessageHeader from './MessageHeader';
import Message from './Message';
import MessageForm from './MessageForm';
import { connect } from 'react-redux';
import { db } from '../../../assets/firebase';
import { ref, child, onValue } from 'firebase/database';

class MainPanel extends Component {
  state = {
    messages: [],
    messagesRef: ref(db, 'messages'),
    messagesLoading: true,
  };

  componentDidMount() {
    const { chatRoom } = this.props;

    if (chatRoom) {
      this.addMessagesListeners(chatRoom.id);
    }
  }

  addMessagesListeners = chatRoomId => {
    onValue(child(this.state.messagesRef, chatRoomId), snapshot => {
      this.setState({ messages: Object.values(snapshot.val()), messagesLoading: false });
    });
  };

  renderMessages = messages =>
    messages.length > 0 &&
    messages.map(message => (
      <Message key={message.timestamp} message={message} user={this.props.user} />
    ));

  render() {
    const { messages } = this.state;

    return (
      <div style={{ padding: '2rem 2rem 0 2rem' }}>
        <MessageHeader />

        <div
          style={{
            width: '100%',
            height: '450px',
            border: '.2rem solid #ececec',
            borderRadius: '4px',
            padding: '1rem',
            marginBottom: '1rem',
            overflowY: 'auto',
          }}
        >
          {this.renderMessages(messages)}
        </div>

        <MessageForm />
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    user: state.user.currentUser,
    chatRoom: state.chatRoom.currentChatRoom,
  };
};

export default connect(mapStateToProps)(MainPanel);
