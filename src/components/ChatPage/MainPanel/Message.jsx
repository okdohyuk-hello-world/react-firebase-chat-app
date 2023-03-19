import React from 'react';
import Card from 'react-bootstrap/Card';
import { formatDistance } from 'date-fns';

function Message({ message, user }) {
  const timeFromNow = timestamp =>
    formatDistance(new Date(timestamp), new Date(), { addSuffix: true });

  const isImage = message => {
    return message.hasOwnProperty('image') && !message.hasOwnProperty('content');
  };

  const isMessageMine = (message, user) => message.user.id === user.uid;

  return (
    <Card
      style={{ display: 'flex', flexDirection: 'row', gap: 8, padding: 8, marginBottom: '30px' }}
    >
      <img
        style={{ borderRadius: '10px' }}
        width={48}
        height={48}
        src={message.user.image}
        alt={message.user.name + '-profile'}
      />
      <Card.Body style={{ backgroundColor: isMessageMine(message, user) && '#ECECEC' }}>
        <h6>
          {message.user.name}{' '}
          <span style={{ fontSize: '10px', color: 'gray' }}>{timeFromNow(message.timestamp)}</span>
        </h6>
        {isImage(message) ? (
          <img style={{ maxWidth: '300px' }} alt={'이미지'} src={message.image} />
        ) : (
          <p>{message.content}</p>
        )}
      </Card.Body>
    </Card>
  );
}

export default Message;
