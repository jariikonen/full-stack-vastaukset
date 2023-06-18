import { React, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import loginService from '../services/login';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { setLoggedInUser } from '../reducers/loggedInReducer';
import { setNotification } from '../reducers/notificationReducer';

const LoginForm = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const login = async (username, password) => {
    console.log('logging in with', username, password, '...');

    try {
      const usr = await loginService.login({ username, password });
      console.log('login succeeded', usr);

      window.localStorage.setItem('loggedBloglistUser', JSON.stringify(usr));

      dispatch(setLoggedInUser(usr));
    } catch (exception) {
      dispatch(
        setNotification('wrong username or password (or both)', 'error')
      );
      console.log('login failed:', exception);
    }
  };

  const handleLogin = async (event) => {
    event.preventDefault();
    login(username, password);
    setUsername('');
    setPassword('');
    navigate('/');
  };

  return (
    <div>
      <form onSubmit={handleLogin}>
        <div>
          <TextField
            label="username"
            size="small"
            id="username"
            type="text"
            value={username}
            name="Username"
            onChange={({ target }) => setUsername(target.value)}
            sx={{ mb: 0.5 }}
          />
        </div>
        <div>
          <TextField
            label="password"
            size="small"
            id="password"
            type="password"
            value={password}
            name="Password"
            onChange={({ target }) => setPassword(target.value)}
            sx={{ mb: 0.5 }}
          />
        </div>
        <Button variant="contained" id="login-button" type="submit">
          login
        </Button>
      </form>
    </div>
  );
};

export default LoginForm;
