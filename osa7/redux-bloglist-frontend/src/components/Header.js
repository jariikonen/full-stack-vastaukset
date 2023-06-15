import React from 'react';
import { useSelector } from 'react-redux';
import Menu from './Menu';
import Notification from './Notification';
import LoginForm from './LoginForm';

const Header = () => {
  const loggedInUser = useSelector((state) => state.loggedInUser);

  return (
    <div>
      {loggedInUser && <Menu />}
      {!loggedInUser ? (
        <div>
          <h2>Log in to application</h2>
          <Notification />
          <LoginForm />
        </div>
      ) : (
        <div>
          <h2>Blogs app</h2>
          <Notification />
        </div>
      )}
    </div>
  );
};

export default Header;
