/* eslint-disable no-console */
/* eslint-disable react/function-component-definition */
import { React, useState, useEffect } from 'react';
import blogService from './services/blogs';
import loginService from './services/login';
import LoginForm from './components/LoginForm';
import BlogList from './components/BlogList';
import CreateBlogForm from './components/CreateBlogForm';
import Notification from './components/Notification';

const App = () => {
  const [blogs, setBlogs] = useState([]);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState(null);
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [url, setUrl] = useState('');
  const [notificationMessage, setNotificationMessage] = useState(null);
  const [notificationType, setNotificationType] = useState(null);

  useEffect(() => {
    blogService.getAll().then((b) => setBlogs(b));
  }, []);

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBloglistUser');
    if (loggedUserJSON) {
      const usr = JSON.parse(loggedUserJSON);
      setUser(usr);
    }
  }, []);

  const setNotification = (message, type) => {
    setNotificationMessage(message);
    setNotificationType(type);
    setTimeout(() => {
      setNotificationMessage(null);
      setNotificationType(null);
    }, 5000);
  };

  const handleLogin = async (event) => {
    event.preventDefault();
    console.log('logging in with', username, password, '...');

    try {
      const usr = await loginService.login({ username, password });
      console.log('login succeeded', usr);

      window.localStorage.setItem('loggedBloglistUser', JSON.stringify(usr));

      setUser(usr);
      setUsername('');
      setPassword('');
    } catch (exception) {
      setNotification(
        'wrong username or password (or both)',
        'error',
      );
      console.log('login failed:', exception);
    }
  };

  const handleLogout = async () => {
    console.log(`logging out user '${user.name}' ...`);
    window.localStorage.removeItem('loggedBloglistUser');
    window.location.reload();
  };

  const handleUsernameChange = ({ target }) => setUsername(target.value);
  const handlePasswordChange = ({ target }) => setPassword(target.value);

  const handleTitleChange = ({ target }) => setTitle(target.value);
  const handleAuthorChange = ({ target }) => setAuthor(target.value);
  const handleUrlChange = ({ target }) => setUrl(target.value);

  const handleCreateBlog = async (event) => {
    event.preventDefault();
    console.log(`creating a new blog: (title) ${title}, (author) ${author}, (url) ${url}`);

    blogService.setToken(user.token);
    const newBlog = await blogService.createBlog({ title, author, url });
    console.log('posting of a new blog succeeded', newBlog);
    setTitle('');
    setAuthor('');
    setUrl('');
    setBlogs(blogs.concat(newBlog));
    setNotification(
      `a new blog ${newBlog.title} added`,
      'success',
    );
  };

  return (
    <div>
      {!user
        ? (
          <div>
            <h2>log in to application</h2>
            <Notification
              message={notificationMessage}
              type={notificationType}
            />
            <LoginForm
              handleLogin={handleLogin}
              username={username}
              handleUsernameChange={handleUsernameChange}
              password={password}
              handlePasswordChange={handlePasswordChange}
            />
          </div>
        )
        : (
          <div>
            <h2>blogs</h2>
            <Notification
              message={notificationMessage}
              type={notificationType}
            />
            <p>
              logged in as
              {' '}
              {user.name}
              {' '}
              <button type="button" onClick={handleLogout}>logout</button>
            </p>

            <CreateBlogForm
              title={title}
              author={author}
              url={url}
              handleTitleChange={handleTitleChange}
              handleAuthorChange={handleAuthorChange}
              handleUrlChange={handleUrlChange}
              handleCreate={handleCreateBlog}
            />
            <BlogList blogs={blogs} />
          </div>
        )}
    </div>
  );
};

export default App;
