import React, { useState } from 'react';
import Form from 'react-bootstrap/Form';
import ProgressBar from 'react-bootstrap/ProgressBar';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { db } from '../../../assets/firebase';
import { ref, serverTimestamp, push, child } from 'firebase/database';
import { useSelector } from 'react-redux';

function MessageForm() {
  const chatRoom = useSelector(state => state.chatRoom.currentChatRoom);
  const user = useSelector(state => state.user.currentUser);
  const [content, setContent] = useState('');
  const [errors, setErrors] = useState([]);
  const [loading, setLoading] = useState(false);
  const messagesRef = ref(db, 'messages');

  const handleContentChange = e => {
    setContent(e.target.value);
  };

  const createMessage = (fileUrl = null) => {
    const message = {
      timestamp: serverTimestamp(),
      user: {
        id: user.uid,
        name: user.displayName,
        image: user.photoURL,
      },
    };

    if (fileUrl !== null) {
      message['image'] = fileUrl;
    } else {
      message['content'] = content;
    }

    return message;
  };

  const handleSubmit = async () => {
    if (!content) {
      setErrors(prev => prev.concat('Type contents first'));
      return;
    }
    setLoading(true);

    try {
      await push(child(messagesRef, chatRoom.id), createMessage());

      setContent('');
      setErrors([]);
    } catch (e) {
      setErrors(prev => prev.concat(e.message));
      setTimeout(() => {
        setErrors([]);
      }, 5000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Form onSubmit={handleSubmit}>
        <Form.Group>
          <Form.Control as="textarea" rows={3} value={content} onChange={handleContentChange} />
        </Form.Group>
      </Form>

      <ProgressBar variant="warning" label="60%" now={60} />

      <div>
        {errors.map(errorMsg => (
          <p style={{ color: 'red' }} key={errorMsg}>
            {errorMsg}
          </p>
        ))}
      </div>

      <Row>
        <Col>
          <button onClick={handleSubmit} className="message-form-button" style={{ width: '100%' }}>
            SEND
          </button>
        </Col>
        <Col>
          <button className="message-form-button" style={{ width: '100%' }}>
            UPLOAD
          </button>
        </Col>
      </Row>
    </div>
  );
}

export default MessageForm;
