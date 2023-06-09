import React, { useRef } from 'react';
import { IoIosChatboxes } from 'react-icons/io';
import Dropdown from 'react-bootstrap/Dropdown';
import Image from 'react-bootstrap/Image';
import { useSelector, useDispatch } from 'react-redux';
import { signOut, updateProfile, getAuth } from 'firebase/auth';
import { auth, storage, db } from '../../../assets/firebase';
import mime from 'mime-types';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { update, ref as databaseRef } from 'firebase/database';
import { setPhotoURL } from '../../../redux/actions/userAction';

function UserPanel() {
  const user = useSelector(state => state.user.currentUser);
  const imageInputRef = useRef();
  const dispatch = useDispatch();

  const handleLogout = () => {
    signOut(auth);
  };

  const handleOpenImageInput = () => {
    imageInputRef.current.click();
  };

  const handleUploadImage = async event => {
    const file = event.target.files[0];
    const metadata = { contentType: mime.lookup(file.name) };
    const storageRef = ref(storage, `images/user/${user.uid}`);

    try {
      // 스토리지에 파일 저장하기
      await uploadBytes(storageRef, file, metadata);

      // 유저 업데이트
      let downloadURL = await getDownloadURL(storageRef);
      const auth = getAuth();

      await updateProfile(auth.currentUser, {
        photoURL: downloadURL,
      });

      // 데이터베이스 업데이트
      await update(databaseRef(db, 'users/' + user.uid), {
        image: downloadURL,
      });

      // 스토어 업데이트
      dispatch(setPhotoURL(downloadURL));
    } catch (e) {
      alert(e);
    }
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
            <Dropdown.Item href="#/action-1" onClick={handleOpenImageInput}>
              프로필 사진 변경
            </Dropdown.Item>
            <Dropdown.Item href="#/action-2" onClick={handleLogout}>
              로그아웃
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
        <input
          ref={imageInputRef}
          onChange={handleUploadImage}
          accept="image/jpeg, image/png"
          style={{ display: 'none' }}
          type="file"
        />
      </div>
    </div>
  );
}

export default UserPanel;
