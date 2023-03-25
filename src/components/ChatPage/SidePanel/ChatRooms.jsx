import React, { Component } from 'react';
import { FaRegSmileWink, FaPlus } from 'react-icons/fa';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { connect } from 'react-redux';
import { ref, child, push, update, onValue, off } from 'firebase/database';
import { db } from '../../../assets/firebase';
import { setCurrentChatRoom, setPrivateChatRoom } from '../../../redux/actions/chatRoomAction';
import Badge from 'react-bootstrap/Badge';

class ChatRooms extends Component {
  state = {
    isModalShow: false,
    isLoading: false,
    name: '',
    description: '',
    isDesabled: true,
    chatRoomsRef: ref(db, 'chatRooms'),
    messageRef: ref(db, 'messages'),
    chatRooms: [],
    isFirstLoad: true,
    activeChatRoomId: '',
    notifications: [],
  };

  componentDidMount() {
    this.addChatRoomsListeners();
  }

  componentWillUnmount() {
    off(this.state.chatRoomsRef);
    off(this.state.messageRef);
  }

  componentWillUpdate(nextProps, { isDesabled, name, description }) {
    if (this.state.isDesabled !== isDesabled) return;
    if (this.state.name === name && this.state.description === description) return;

    if (name && description) {
      this.setState({ isDesabled: false });
    } else {
      this.setState({ isDesabled: true });
    }
  }

  getNotificationCount = room => {
    // 해당 채팅방의 count수를 구하는 중입니다.
    let count = 0;

    this.state.notifications.forEach(notification => {
      if (notification.id === room.id) {
        count = notification.count;
      }
    });

    if (count > 0) return count;
  };

  renderChatRooms = chatRooms =>
    chatRooms.length &&
    chatRooms.map(room => (
      <li
        key={room.id}
        onClick={() => this.changeChatRoom(room)}
        style={{
          cursor: 'pointer',
          width: '100%',
          display: 'flex',
          marginBottom: 2,
          justifyContent: 'space-between',
          backgroundColor: room.id === this.state.activeChatRoomId && '#ffffff45',
        }}
      >
        <span># {room.name}</span>
        <Badge bg="danger">{this.getNotificationCount(room)}</Badge>
      </li>
    ));

  addChatRoomsListeners = () => {
    onValue(this.state.chatRoomsRef, snapshot => {
      const chatRoomArray = Object.values(snapshot.val()).filter(v => typeof v !== 'string');
      this.setState({ chatRooms: chatRoomArray }, () => this.setFirstChatRoom());
      chatRoomArray.forEach(room => this.addNotificationListener(room.id));
    });
  };

  addNotificationListener = chatRoomId => {
    onValue(child(this.state.messageRef, chatRoomId), snapshot => {
      if (this.props.chatRoom) {
        this.handleNotification(
          chatRoomId,
          this.props.chatRoom.id,
          this.state.notifications,
          snapshot,
        );
      }
    });
  };

  addChatRoom = async () => {
    this.setState({ isLoading: true });
    const key = push(this.state.chatRoomsRef, 'chatRooms').key;
    const { name, description } = this.state;
    const { user } = this.props;
    const newChatRoom = {
      id: key,
      name: name,
      description: description,
      createdBy: {
        name: user.displayName,
        image: user.photoURL,
      },
    };

    try {
      await update(child(this.state.chatRoomsRef, key), newChatRoom);
      this.setState({
        name: '',
        description: '',
        isDesabled: true,
        isModalShow: false,
      });
    } catch (e) {
      console.error(e);
      //alert(e);
    } finally {
      this.setState({
        isLoading: false,
      });
    }
  };

  setFirstChatRoom = () => {
    const firstChatRoom = this.state.chatRooms[0];
    if (this.state.isFirstLoad && this.state.chatRooms.length) {
      this.props.dispatch(setCurrentChatRoom(firstChatRoom));

      this.setState({ isFirstLoad: false, activeChatRoomId: firstChatRoom.id });
    }
  };

  changeChatRoom = room => {
    this.props.dispatch(setCurrentChatRoom(room));
    this.props.dispatch(setPrivateChatRoom(false));
    this.setState({ activeChatRoomId: room.id });
    this.clearNotifications(room.id);
  };

  clearNotifications = roomId => {
    let index = this.state.notifications.findIndex(notification => notification.id === roomId);

    if (index !== -1) {
      let updatedNotifications = [...this.state.notifications];
      updatedNotifications[index].lastKnownTotal = this.state.notifications[index].total;
      updatedNotifications[index].count = 0;
      this.setState({ notifications: updatedNotifications });
    }
  };

  handleNotification = (chatRoomId, currentChatRoomId, notifications, snapshot) => {
    let lastTotal = 0;

    // 이미 notifications state 안에 알림 정보가 있는 채팅방과 그렇지 않는 것을 나눠주기
    let index = notifications.findIndex(notification => notification.id === chatRoomId);

    if (index === -1) {
      notifications.push({
        id: chatRoomId,
        total: snapshot.size,
        lastKnownTotal: snapshot.size,
        count: 0,
      });
    }
    // 이미 해당 채팅방의 알림 정보가 있을 때
    else {
      // 상대방이 채팅 보내는 그 해당 채팅방에 있지 않을 때
      if (chatRoomId !== currentChatRoomId) {
        // 현재까지 유저가 확인한 총 메시지 개수
        lastTotal = notifications[index].lastKnownTotal;

        // count 알림으로 보여줄 숫자를 구하기
        // 현재 총 메시기 개수 - 이전에 확인한 총 메시지 개수
        // 현재 총 메시지 개수가 10개이고 이전에 확인한 메시지가 총 8개 있다면, 2개를 알림으로 보여줘야함.
        if (snapshot.size - lastTotal > 0) {
          notifications[index].count = snapshot.size - lastTotal;
        }
      }
      notifications[index].total = snapshot.size;
    }

    // 목표는 방 하나 하나의 맞는 정보를 넣어주기
    this.setState({ notifications });
  };

  handleModalClose = () => this.setState({ isModalShow: false });
  handleModalShow = () => this.setState({ isModalShow: true });

  handleSubmit = e => {
    e.preventDefault();

    this.addChatRoom();
  };

  render() {
    return (
      <div>
        <div style={{ position: 'relative', width: '100%', display: 'flex', alignItems: 'center' }}>
          <FaRegSmileWink style={{ marginRight: 3 }} />
          CHAT ROOMS ({this.state.chatRooms.length})
          <FaPlus
            onClick={this.handleModalShow}
            style={{ position: 'absolute', right: 0, cursor: 'pointer' }}
          />
        </div>

        <ul style={{ listStyleType: 'none', padding: 0 }}>
          {this.renderChatRooms(this.state.chatRooms)}
        </ul>

        <Modal show={this.state.isModalShow} onHide={this.handleModalClose}>
          <Modal.Header closeButton>
            <Modal.Title>Create a chat room</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form onSubmit={this.handleSubmit}>
              <Form.Group className="mb-3" controlId="formBasicEmail">
                <Form.Label>방 이름</Form.Label>
                <Form.Control
                  value={this.state.name}
                  onChange={e => this.setState({ name: e.target.value })}
                  type="text"
                  placeholder="Enter a room name"
                />
              </Form.Group>

              <Form.Group className="mb-3" controlId="formBasicPassword">
                <Form.Label>방 설명</Form.Label>
                <Form.Control
                  value={this.state.description}
                  onChange={e => this.setState({ description: e.target.value })}
                  type="text"
                  placeholder="Enter a chat room description"
                />
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={this.handleModalClose}>
              Close
            </Button>
            <Button
              onClick={this.handleSubmit}
              type="submit"
              variant="primary"
              disabled={this.state.isDesabled || this.state.isLoading}
            >
              Create
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return { user: state.user.currentUser, chatRoom: state.chatRoom.currentChatRoom };
};

export default connect(mapStateToProps)(ChatRooms);
