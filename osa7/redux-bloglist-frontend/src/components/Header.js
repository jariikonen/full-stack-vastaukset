import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setLoggedInUser } from '../reducers/loggedInReducer';
import Notification from './Notification';
import LoginForm from './LoginForm';

const Header = () => {
  const dispatch = useDispatch();
  const loggedInUser = useSelector((state) => state.loggedInUser);

  const handleLogout = async () => {
    console.log(`logging out user '${loggedInUser.name}' ...`);
    window.localStorage.removeItem('loggedBloglistUser');
    dispatch(setLoggedInUser(null));
    window.location.reload();
  };

  return (
    <div>
      {!loggedInUser ? (
        <div>
          <h2>Log in to application</h2>
          <Notification />
          <LoginForm />
        </div>
      ) : (
        <div>
          <h2>Blogs</h2>
          <Notification />
          <p>
            logged in as {loggedInUser.name}{' '}
            <button type="button" onClick={handleLogout}>
              logout
            </button>
          </p>
        </div>
      )}
    </div>
  );
};

export default Header;
