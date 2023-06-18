import React from 'react';
import { useSelector } from 'react-redux';
import Container from '@mui/material/Container';
import MenuBar from './MenuBar';
import Notification from './Notification';
import LoginForm from './LoginForm';

const Header = () => {
  const loggedInUser = useSelector((state) => state.loggedInUser);

  return (
    <div>
      <MenuBar />
      {!loggedInUser ? (
        <Container>
          <h2>Log in to application</h2>
          <Notification />
          <LoginForm />
        </Container>
      ) : (
        <div>
          <Notification />
        </div>
      )}
    </div>
  );
};

export default Header;
