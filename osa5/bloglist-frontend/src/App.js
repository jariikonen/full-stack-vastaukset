/* eslint-disable no-console */
/* eslint-disable react/function-component-definition */
import { React, useState, useEffect } from 'react';
import blogService from './services/blogs';
import loginService from './services/login';
import LoginForm from './components/LoginForm';
import BlogList from './components/BlogList';

const App = () => {
  const [blogs, setBlogs] = useState([]);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState(null);

  useEffect(() => {
    blogService.getAll().then((b) => setBlogs(b));
  }, []);

  const handleLogin = async (event) => {
    event.preventDefault();
    console.log('logging in with', username, password, '...');

    try {
      const usr = await loginService.login({ username, password });
      console.log('login succeeded', usr);
      setUser(usr);
      setUsername('');
      setPassword('');
    } catch (exception) {
      console.log('login failed:', exception);
    }
  };

  const handleUsernameChange = ({ target }) => setUsername(target.value);
  const handlePasswordChange = ({ target }) => setPassword(target.value);

  return (
    <div>
      {user === null
        ? (
          <LoginForm
            handleLogin={handleLogin}
            username={username}
            handleUsernameChange={handleUsernameChange}
            password={password}
            handlePasswordChange={handlePasswordChange}
          />
        )
        : (
          <div>
            <h2>blogs</h2>
            <p>
              logged in as
              {' '}
              {user.name}
            </p>

            <BlogList blogs={blogs} />
          </div>
        )}
    </div>
  );
};

export default App;
