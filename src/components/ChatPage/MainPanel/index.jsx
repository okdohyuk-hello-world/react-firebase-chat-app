import React, { Component } from 'react';
import MessageHeader from './MessageHeader';
import Message from './Message';
import MessageForm from './MessageForm';
import { connect } from 'react-redux';
import { db } from '../../../assets/firebase';
import { ref, child, onValue, off } from 'firebase/database';

class MainPanel extends Component {
  state = {
    messages: [],
    messagesRef: ref(db, 'messages'),
    messagesLoading: true,
    searchTerm: '',
    searchResults: [],
    searchLoading: false,
  };

  componentDidMount() {
    const { chatRoom } = this.props;

    if (chatRoom) {
      this.addMessagesListeners(chatRoom.id);
    }
  }

  componentWillUnmount() {
    off(this.state.messagesRef);
  }

  addMessagesListeners = chatRoomId => {
    onValue(child(this.state.messagesRef, chatRoomId), snapshot => {
      let messageArray = [];
      if (snapshot.val() !== null) messageArray = Object.values(snapshot.val());
      this.setState({ messages: messageArray, messagesLoading: false });
    });
  };

  renderMessages = messages =>
    messages.length > 0 &&
    messages.map(message => (
      <Message key={message.timestamp} message={message} user={this.props.user} />
    ));

  handleSearchMessages = () => {
    const chatRoomMessages = [...this.state.messages];
    const regex = new RegExp(this.state.searchTerm, 'gi');
    const searchResults = chatRoomMessages.reduce((acc, message) => {
      if ((message.content && message.content.match(regex)) || message.user.name.match(regex)) {
        acc.push(message);
      }
      return acc;
    }, []);
    this.setState({ searchResults, searchLoading: false });
  };

  handleSearchChange = event => {
    this.setState(
      {
        searchTerm: event.target.value,
        searchLoading: true,
      },
      this.handleSearchMessages,
    );
  };

  render() {
    const { searchTerm, messages, searchResults } = this.state;

    return (
      <div style={{ padding: '2rem 2rem 0 2rem' }}>
        <MessageHeader handleSearchChange={this.handleSearchChange} />

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
          {searchTerm ? this.renderMessages(searchResults) : this.renderMessages(messages)}
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
