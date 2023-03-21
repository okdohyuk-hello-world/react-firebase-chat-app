import React, { Component } from 'react';
import { FaRegSmile } from 'react-icons/fa';
import { db } from '../../../assets/firebase';
import { ref, onValue } from 'firebase/database';
import { connect } from 'react-redux';

class DirectMessages extends Component {
  state = {
    usersRef: ref(db, 'users'),
    users: [],
  };

  componentDidMount() {
    if (this.props.user) this.addUsersListeners(this.props.user.uid);
  }

  addUsersListeners = currentUserId => {
    let usersArray = [];

    onValue(this.state.usersRef, snapshot => {
      const snapshotObj = snapshot.val();
      Object.keys(snapshotObj).forEach(key => {
        if (currentUserId !== key) {
          let user = snapshotObj[key];
          user['uid'] = key;
          user['status'] = 'offline';
          usersArray.push(user);
        }
      });
      this.setState({ users: usersArray });
    });
  };

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

const mapStateToProps = state => {
  return {
    user: state.user.currentUser,
  };
};

export default connect(mapStateToProps)(DirectMessages);
