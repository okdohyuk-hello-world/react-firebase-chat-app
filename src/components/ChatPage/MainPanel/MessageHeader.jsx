import React, { useEffect, useState } from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import Image from 'react-bootstrap/Image';
import Accordion from 'react-bootstrap/Accordion';
import Card from 'react-bootstrap/Card';
import { FaLock, FaLockOpen } from 'react-icons/fa';
import { MdFavorite, MdFavoriteBorder } from 'react-icons/md';
import { AiOutlineSearch } from 'react-icons/ai';
import { useSelector } from 'react-redux';
import { db } from '../../../assets/firebase';
import { ref, child, update, remove, get } from 'firebase/database';

function MessageHeader({ handleSearchChange }) {
  const chatRoom = useSelector(state => state.chatRoom.currentChatRoom);
  const isPrivateChatRoom = useSelector(state => state.chatRoom.isPrivateChatRoom);
  const [isFavorited, setIsFavorited] = useState(false);
  const userRef = ref(db, 'users');
  const user = useSelector(state => state.user.currentUser);

  useEffect(() => {
    if (chatRoom && user) addFavoriteListener(chatRoom.id, user.uid);
  }, []);

  const addFavoriteListener = (chatRoomId, userId) => {
    get(child(userRef, `${userId}/favorited`)).then(res => {
      const favoriteChatRooms = res.val();
      if (favoriteChatRooms) setIsFavorited(Object.keys(favoriteChatRooms).includes(chatRoomId));
    });
  };

  const handleFavorite = () => {
    if (isFavorited) {
      remove(child(userRef, `${user.uid}/favorited/${chatRoom.id}`))
        .then(() => setIsFavorited(isFavorited => !isFavorited))
        .catch(e => console.error(e));
    } else {
      update(child(userRef, `${user.uid}/favorited`), {
        [chatRoom.id]: {
          name: chatRoom.name,
          description: chatRoom.description,
          createdBy: {
            name: chatRoom.createdBy.name,
            image: chatRoom.createdBy.image,
          },
        },
      })
        .then(() => setIsFavorited(isFavorited => !isFavorited))
        .catch(e => console.error(e));
    }
  };

  return (
    <div
      style={{
        width: '100%',
        height: 'auto',
        border: '.2rem solid #ececec',
        borderRadius: '4px',
        padding: '1rem',
        marginBottom: '1rem',
      }}
    >
      <Container>
        <Row>
          <Col>
            <h2 style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              {isPrivateChatRoom ? <FaLock /> : <FaLockOpen />} {chatRoom && chatRoom.name}{' '}
              {!isPrivateChatRoom && (
                <span style={{ cursor: 'pointer', display: 'flex' }} onClick={handleFavorite}>
                  {isFavorited ? <MdFavorite /> : <MdFavoriteBorder />}
                </span>
              )}
            </h2>
          </Col>
          <Col>
            <InputGroup className="mb-3">
              <InputGroup.Text id="basic-addon1">
                <AiOutlineSearch />
              </InputGroup.Text>
              <Form.Control
                placeholder="Search Message"
                aria-label="Search"
                aria-describedby="basic-addon1"
                onChange={handleSearchChange}
              />
            </InputGroup>
          </Col>
        </Row>
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <p>
            <Image src="" /> {''}user name
          </p>
        </div>
        <Row>
          <Col>
            <Accordion>
              <Card>
                <Card.Header>
                  <Accordion.Button eventKey="0">123</Accordion.Button>
                </Card.Header>
                <Accordion.Body eventKey="0">
                  <Card.Body>Hello! I'm the body</Card.Body>
                </Accordion.Body>
              </Card>
            </Accordion>
          </Col>
          <Col>
            <Accordion>
              <Card>
                <Card.Header>
                  <Accordion.Button eventKey="0">123</Accordion.Button>
                </Card.Header>
                <Accordion.Body eventKey="0">
                  <Card.Body>Hello! I'm the body</Card.Body>
                </Accordion.Body>
              </Card>
            </Accordion>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default MessageHeader;
