/* eslint-disable no-console */
/* eslint-disable react/function-component-definition */
import {
  React,
  useState,
  useEffect,
  useRef,
} from 'react';
import blogService from './services/blogs';
import loginService from './services/login';
import LoginForm from './components/LoginForm';
import BlogList from './components/BlogList';
import CreateBlogForm from './components/CreateBlogForm';
import Notification from './components/Notification';
import Togglable from './components/Togglable';

const App = () => {
  const [blogs, setBlogs] = useState([]);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState(null);
  const [notificationMessage, setNotificationMessage] = useState(null);
  const [notificationType, setNotificationType] = useState(null);

  const blogFormRef = useRef();

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

  const createBlog = async (blogObject) => {
    console.log('creating a new blog:', blogObject);

    blogService.setToken(user.token);
    const returnedBlog = await blogService.createBlog(blogObject);

    console.log('posting of a new blog succeeded', returnedBlog);

    setBlogs(blogs.concat(returnedBlog));
    setNotification(
      `a new blog ${returnedBlog.title} added`,
      'success',
    );
    blogFormRef.current.toggleVisibility();
  };

  const likeBlog = async (blogObject) => {
    console.log('liking blog', blogObject);

    blogService.setToken(user.token);
    const returnedBlog = await blogService.updateBlog(blogObject);

    console.log('liking blog succeeded', returnedBlog);

    setBlogs(blogs.map((blog) => (
      blog.id !== returnedBlog.id ? blog : returnedBlog
    )));
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

            <Togglable buttonLabel="create blog" ref={blogFormRef}>
              <CreateBlogForm createBlog={createBlog} />
            </Togglable>
            <BlogList blogs={blogs} likeBlog={likeBlog} />
          </div>
        )}
    </div>
  );
};

export default App;
