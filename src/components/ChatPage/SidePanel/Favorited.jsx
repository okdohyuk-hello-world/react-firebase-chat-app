import React, { Component } from 'react';
import { FaRegSmileBeam } from 'react-icons/fa';
import { db } from '../../../assets/firebase';
import { ref, onValue, child, off } from 'firebase/database';
import { connect } from 'react-redux';
import { setCurrentChatRoom, setPrivateChatRoom } from '../../../redux/actions/chatRoomAction';

class Favorited extends Component {
  state = {
    favoritedChatRoom: [],
    usersRef: ref(db, 'users'),
    activeChatRoomId: '',
  };

  componentDidMount() {
    if (this.props.user) this.addListeners(this.props.user.uid);
  }

  componentWillUnmount() {
    off(this.state.usersRef);
  }

  addListeners = userId => {
    const { usersRef } = this.state;
    onValue(child(usersRef, `${userId}/favorited`), snapshot => {
      const favoriteChatRoom = snapshot.val();
      if (favoriteChatRoom === null) return this.setState({ favoritedChatRoom: [] });
      this.setState({ favoritedChatRoom: Object.values(favoriteChatRoom) });
    });
  };

  changeChatRoom = room => {
    this.props.dispatch(setCurrentChatRoom(room));
    this.props.dispatch(setPrivateChatRoom(false));
    this.setState({ activeChatRoomId: room.id });
  };

  renderFavoritedChatRooms = favoritedChatRoom =>
    favoritedChatRoom.length > 0 &&
    favoritedChatRoom.map(chatRoom => (
      <li
        key={chatRoom.id}
        onClick={() => this.changeChatRoom(chatRoom)}
        style={{
          backgroundColor: chatRoom.id === this.state.activeChatRoomId && '#ffffff45',
          cursor: 'pointer',
        }}
      >
        # {chatRoom.name}
      </li>
    ));

  render() {
    const { favoritedChatRoom } = this.state;

    return (
      <div>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <FaRegSmileBeam style={{ marginRight: '3px' }} />
          FAVORITEDD ({favoritedChatRoom.length})
        </div>
        <ul style={{ listStyleType: 'none', padding: 0 }}>
          {this.renderFavoritedChatRooms(favoritedChatRoom)}
        </ul>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    user: state.user.currentUser,
  };
};

export default connect(mapStateToProps)(Favorited);
