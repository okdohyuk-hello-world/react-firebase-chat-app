import React from 'react';
import { IoIosChatboxes } from 'react-icons/io';
import Dropdown from 'react-bootstrap/Dropdown';
import Image from 'react-bootstrap/Image';
import { useSelector } from 'react-redux';
import { signOut } from 'firebase/auth';
import { auth } from '../../../assets/firebase';

function UserPanel() {
  const user = useSelector(state => state.user.currentUser);

  const handleLogout = () => {
    signOut(auth);
  };

  return (
    <div>
      <h3 style={{ color: 'white' }}>
        <IoIosChatboxes /> Chat App
      </h3>

      <div style={{ display: 'flex', marginBottom: '1rem' }}>
        <Image
          src={user && user.photoURL}
          style={{ width: '30px', height: '30px', marginTop: '3px' }}
          roundedCircle
        />

        <Dropdown>
          <Dropdown.Toggle style={{ background: 'transparent', boder: '0px' }} id="dropdown-basic">
            {user.displayName}
          </Dropdown.Toggle>

          <Dropdown.Menu>
            <Dropdown.Item href="#/action-1">프로필 사진 변경</Dropdown.Item>
            <Dropdown.Item href="#/action-2" onClick={handleLogout}>
              로그아웃
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </div>
    </div>
  );
}

export default UserPanel;
