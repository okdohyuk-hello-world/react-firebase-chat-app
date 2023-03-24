import React, { Component } from 'react';
import MessageHeader from './MessageHeader';
import Message from './Message';
import MessageForm from './MessageForm';
import { connect } from 'react-redux';
import { db } from '../../../assets/firebase';
import { ref, child, onValue, off } from 'firebase/database';
import { setUserPosts } from '../../../redux/actions/chatRoomAction';

class MainPanel extends Component {
  messageEndRef = React.createRef();
  state = {
    messages: [],
    messagesRef: ref(db, 'messages'),
    typingRef: ref(db, 'typing'),
    messagesLoading: true,
    searchTerm: '',
    searchResults: [],
    searchLoading: false,
    typingUsers: [],
  };

  componentDidMount() {
    const { chatRoom } = this.props;

    if (chatRoom) {
      this.addMessagesListeners(chatRoom.id);
      this.addTypingListeners(chatRoom.id);
    }
  }

  componentWillUnmount() {
    off(this.state.messagesRef);
    off(this.state.typingRef);
  }

  componentDidUpdate() {
    if (this.messageEndRef) {
      this.messageEndRef.scrollIntoView({ behavior: 'smooth' });
    }
  }

  addTypingListeners = chatRoomId => {
    onValue(child(this.state.typingRef, chatRoomId), snapshot => {
      let typingUsers = [];
      if (snapshot.val() !== null)
        typingUsers = Object.entries(snapshot.val())
          .filter(([key]) => key !== this.props.user.uid)
          .map(([key, value]) => {
            return { id: key, name: value };
          });
      this.setState({ typingUsers });
    });
  };

  addMessagesListeners = chatRoomId => {
    onValue(child(this.state.messagesRef, chatRoomId), snapshot => {
      let messageArray = [];
      if (snapshot.val() !== null) messageArray = Object.values(snapshot.val());
      this.setState({ messages: messageArray, messagesLoading: false });
      this.userPostsCount(messageArray);
    });
  };

  userPostsCount = messages => {
    let userPosts = messages.reduce((acc, message) => {
      if (message.user.name in acc) {
        acc[message.user.name].count += 1;
      } else {
        acc[message.user.name] = {
          image: message.user.image,
          count: 1,
        };
      }
      return acc;
    }, {});
    this.props.dispatch(setUserPosts(userPosts));
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

  renderTypingUsers = typingUsers =>
    typingUsers.length > 0 &&
    typingUsers.map(user => <span>{user.name}님이 채팅을 입력하고 있습니다...</span>);

  render() {
    const { searchTerm, messages, searchResults, typingUsers } = this.state;
    console.log(this.state.typingUsers);

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

          {this.renderTypingUsers(typingUsers)}

          <div ref={node => (this.messageEndRef = node)} />
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
