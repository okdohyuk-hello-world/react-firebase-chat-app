import React, { Component } from 'react';
import { FaRegSmile } from 'react-icon/fa';

class DirectMessages extends Component {
  state = {};

  renderDirectMessages = () => {};

  render() {
    return (
      <div>
        <span style={{ display: 'flex', alignItems: 'center' }}>
          <FaRegSmile style={{ marginRight: 3 }} /> DIRECT MESSAGES(1)
        </span>

        <ul style={{ listStyleType: 'none', padding: 0 }}>{this.renderDirectMessages()}</ul>
      </div>
    );
  }
}

export default DirectMessages;
