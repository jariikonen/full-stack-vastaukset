/* eslint-disable no-console */
import { React, useState, useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import loginService from './services/login';
import LoginForm from './components/LoginForm';
import BlogList from './components/BlogList';
import CreateBlogForm from './components/CreateBlogForm';
import Notification from './components/Notification';
import Togglable from './components/Togglable';
import { setNotification } from './reducers/notificationReducer';
import { initializeBlogs } from './reducers/blogsReducer';

const App = () => {
  const [user, setUser] = useState(null);

  const blogFormRef = useRef();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(initializeBlogs());
  }, [dispatch]);

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBloglistUser');
    if (loggedUserJSON) {
      const usr = JSON.parse(loggedUserJSON);
      setUser(usr);
    }
  }, []);

  const login = async (username, password) => {
    console.log('logging in with', username, password, '...');

    try {
      const usr = await loginService.login({ username, password });
      console.log('login succeeded', usr);

      window.localStorage.setItem('loggedBloglistUser', JSON.stringify(usr));

      setUser(usr);
    } catch (exception) {
      dispatch(
        setNotification('wrong username or password (or both)', 'error')
      );
      console.log('login failed:', exception);
    }
  };

  const handleLogout = async () => {
    console.log(`logging out user '${user.name}' ...`);
    window.localStorage.removeItem('loggedBloglistUser');
    window.location.reload();
  };

  return (
    <div>
      {!user ? (
        <div>
          <h2>log in to application</h2>
          <Notification />
          <LoginForm login={login} />
        </div>
      ) : (
        <div>
          <h2>blogs</h2>
          <Notification />
          <p>
            logged in as {user.name}{' '}
            <button type="button" onClick={handleLogout}>
              logout
            </button>
          </p>

          <Togglable buttonLabel="create blog" ref={blogFormRef}>
            <CreateBlogForm user={user} blogFormRef={blogFormRef} />
          </Togglable>
          <BlogList user={user} />
        </div>
      )}
    </div>
  );
};

export default App;
