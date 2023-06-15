import { React, useState } from 'react';
import { useDispatch } from 'react-redux';
import loginService from '../services/login';
import { setLoggedInUser } from '../reducers/loggedInReducer';
import { setNotification } from '../reducers/notificationReducer';

const LoginForm = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const dispatch = useDispatch();

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
  };

  return (
    <div>
      <form onSubmit={handleLogin}>
        <div>
          username{' '}
          <input
            id="username"
            type="text"
            value={username}
            name="Username"
            onChange={({ target }) => setUsername(target.value)}
          />
        </div>
        <div>
          password{' '}
          <input
            id="password"
            type="password"
            value={password}
            name="Password"
            onChange={({ target }) => setPassword(target.value)}
          />
        </div>
        <button id="login-button" type="submit">
          login
        </button>
      </form>
    </div>
  );
};

export default LoginForm;
