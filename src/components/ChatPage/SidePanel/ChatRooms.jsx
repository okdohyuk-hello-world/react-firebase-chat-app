import React, { Component } from 'react';
import { FaRegSmileWink, FaPlus } from 'react-icons/fa';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { connect } from 'react-redux';
import { ref, child, push, update, onValue } from 'firebase/database';
import { db } from '../../../assets/firebase';
import { setCurrentChatRoom } from '../../../redux/actions/chatRoomAction';

class ChatRooms extends Component {
  state = {
    isModalShow: false,
    isLoading: false,
    name: '',
    description: '',
    isDesabled: true,
    chatRoomsRef: ref(db, 'chatRooms'),
    chatRooms: [],
    isFirstLoad: true,
    activeChatRoomId: '',
  };

  componentDidMount() {
    this.addChatRoomsListeners();
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

  renderChatRooms = chatRooms =>
    chatRooms.length &&
    chatRooms.map(room => (
      <li
        key={room.id}
        onClick={() => this.changeChatRoom(room)}
        style={{
          cursor: 'pointer',
          backgroundColor: room.id === this.state.activeChatRoomId && '#ffffff45',
        }}
      >
        # {room.name}
      </li>
    ));

  addChatRoomsListeners = () => {
    onValue(this.state.chatRoomsRef, snapshot => {
      this.setState({ chatRooms: Object.values(snapshot.val()) }, () => this.setFirstChatRoom());
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
      alert(e);
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
    this.setState({ activeChatRoomId: room.id });
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
  return { user: state.user.currentUser };
};

export default connect(mapStateToProps)(ChatRooms);
