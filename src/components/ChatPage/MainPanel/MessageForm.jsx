import React, { useEffect, useRef, useState } from 'react';
import Form from 'react-bootstrap/Form';
import ProgressBar from 'react-bootstrap/ProgressBar';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { db, storage } from '../../../assets/firebase';
import { ref, serverTimestamp, set, push, child, remove } from 'firebase/database';
import { ref as sRef, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { useSelector } from 'react-redux';
import mime from 'mime-types';

function MessageForm() {
  const chatRoom = useSelector(state => state.chatRoom.currentChatRoom);
  const user = useSelector(state => state.user.currentUser);
  const [content, setContent] = useState('');
  const [errors, setErrors] = useState([]);
  const [percentage, setPercentage] = useState(0);
  const [loading, setLoading] = useState(false);
  const messagesRef = ref(db, 'messages');
  const typingRef = ref(db, 'typing');
  const inputOpenImageRef = useRef();
  const isPrivateChatRoom = useSelector(state => state.chatRoom.isPrivateChatRoom);

  useEffect(() => {
    if (!chatRoom || !user) return;
    onContentsChange(content);
  }, [content]);

  useEffect(() => {
    if (!chatRoom || !user) return;
    return () => onContentsChange();
  }, []);

  const handleContentChange = e => {
    setContent(e.target.value);
  };

  const handleOpenImageRef = () => {
    inputOpenImageRef.current.click();
  };

  const getPath = () => {
    if (isPrivateChatRoom) {
      return `/message/private/${chatRoom.id}`;
    } else {
      return '/message/public';
    }
  };

  const handleUploadImage = e => {
    const file = e.target.files[0];
    const filePath = `${getPath()}/${file.name}`;
    const metadata = { contentType: mime.lookup(file.name) };
    const storageRef = sRef(storage, filePath);

    setLoading(true);

    try {
      let uploadTask = uploadBytesResumable(storageRef, file, metadata);

      uploadTask.on(
        'state_changed',
        snapshot => {
          const percentage = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
          setPercentage(percentage);
        },
        err => {
          console.error(err);
          setLoading(false);
        },
        () => {
          // 데이터 베이스 저장
          getDownloadURL(storageRef).then(downloadURL => {
            push(child(messagesRef, chatRoom.id), createMessage(downloadURL));
            setLoading(false);
          });
        },
      );
    } catch (e) {
      alert(e);
    }
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

  const onContentsChange = content => {
    if (content) {
      set(child(typingRef, `${chatRoom.id}/${user.uid}`), user.displayName);
    } else {
      remove(child(typingRef, `${chatRoom.id}/${user.uid}`));
    }
  };

  const handleKeyDown = e => {
    if (e.ctrlKey && e.keyCode === 13) handleSubmit();
  };

  return (
    <div>
      <Form onSubmit={handleSubmit}>
        <Form.Group>
          <Form.Control
            as="textarea"
            rows={3}
            value={content}
            onChange={handleContentChange}
            onKeyDown={handleKeyDown}
          />
        </Form.Group>
      </Form>

      {!(percentage === 0 || percentage === 100) && (
        <ProgressBar
          style={{ marginTop: '1rem' }}
          variant="warning"
          label={percentage + '%'}
          now={percentage}
        />
      )}

      <div>
        {errors.map(errorMsg => (
          <p style={{ color: 'red' }} key={errorMsg}>
            {errorMsg}
          </p>
        ))}
      </div>

      <Row>
        <Col>
          <button
            onClick={handleSubmit}
            className="message-form-button"
            style={{ width: '100%' }}
            disabled={loading}
          >
            SEND
          </button>
        </Col>
        <Col>
          <button
            onClick={handleOpenImageRef}
            className="message-form-button"
            style={{ width: '100%' }}
            disabled={loading}
          >
            UPLOAD
          </button>
        </Col>
      </Row>

      <input
        ref={inputOpenImageRef}
        style={{ display: 'none' }}
        type="file"
        accept="image/jpeg, image/png"
        onChange={handleUploadImage}
      />
    </div>
  );
}

export default MessageForm;
