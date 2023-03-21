import React, { Component } from 'react';
import { FaRegSmile } from 'react-icons/fa';
import { db } from '../../../assets/firebase';
import { ref, onValue } from 'firebase/database';
import { connect } from 'react-redux';
import { setCurrentChatRoom, setPrivateChatRoom } from '../../../redux/actions/chatRoomAction';

class DirectMessages extends Component {
  state = {
    usersRef: ref(db, 'users'),
    users: [],
    activeChatRoom: '',
  };

  componentDidMount() {
    if (this.props.user) this.addUsersListeners(this.props.user.uid);
  }

  addUsersListeners = currentUserId => {
    onValue(this.state.usersRef, snapshot => {
      const usersArray = Object.entries(snapshot.val())
        .filter(([key]) => currentUserId !== key)
        .map(([key, user]) => ({ ...user, uid: key, status: 'offline' }));

      this.setState({ users: usersArray });
    });
  };

  getChatRoomId = userId => {
    const currentUserId = this.props.user.uid;

    return userId > currentUserId ? `${userId}/${currentUserId}` : `${currentUserId}/${userId}`;
  };

  changeChatRoom = user => {
    const chatRoomId = this.getChatRoomId(user.uid);
    const chatRoomData = {
      id: chatRoomId,
      name: user.name,
    };
    this.props.dispatch(setCurrentChatRoom(chatRoomData));
    this.props.dispatch(setPrivateChatRoom(true));
    this.setActiveChatRoom(user.uid);
  };

  setActiveChatRoom = userId => {
    this.setState({ activeChatRoom: userId });
  };

  renderDirectMessages = users =>
    users.length > 0 &&
    users.map(user => (
      <li
        key={user.uid}
        style={{ backgroundColor: user.uid === this.state.activeChatRoom && '#ffffff45' }}
        onClick={() => this.changeChatRoom(user)}
      >
        # {user.name}
      </li>
    ));

  render() {
    const { users } = this.state;
    return (
      <div>
        <span style={{ display: 'flex', alignItems: 'center' }}>
          <FaRegSmile style={{ marginRight: 3 }} /> DIRECT MESSAGES(1)
        </span>

        <ul style={{ listStyleType: 'none', padding: 0 }}>{this.renderDirectMessages(users)}</ul>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    user: state.user.currentUser,
  };
};

export default connect(mapStateToProps)(DirectMessages);
