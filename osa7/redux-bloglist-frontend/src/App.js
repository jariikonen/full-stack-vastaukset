/* eslint-disable no-console */
import { React, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Routes, Route, useMatch, Navigate } from 'react-router-dom';
import { Container, CssBaseline } from '@mui/material';
import { initializeBlogs } from './reducers/blogsReducer';
import { initializeLoggedInUser } from './reducers/loggedInReducer';
import { initializeUserList, removeUserBlog } from './reducers/userListReducer';
import { setBlogs } from './reducers/blogsReducer';
import Header from './components/Header';
import HomeView from './components/HomeView';
import UserListView from './components/UserListView';
import SingleUserView from './components/SingleUserView';
import SingleBlogView from './components/SingleBlogView';
import blogService from './services/blogs';

const App = () => {
  const dispatch = useDispatch();
  const usersMatch = useMatch('/users/:id');
  const blogsMatch = useMatch('/blogs/:id');

  useEffect(() => {
    dispatch(initializeBlogs());
    dispatch(initializeLoggedInUser());
    dispatch(initializeUserList());
  }, [dispatch]);

  const userList = useSelector((state) => state.userList);
  const user = usersMatch
    ? userList.find((user) => user.id === usersMatch.params.id)
    : null;

  const blogs = useSelector((state) => state.blogs);
  const blog = blogsMatch
    ? blogs.find((blog) => blog.id === blogsMatch.params.id)
    : null;

  const loggedInUser = useSelector((state) => state.loggedInUser);

  const likeBlog = async (blog) => {
    console.log('liking blog', blog);

    blogService.setToken(loggedInUser.token);
    const returnedBlog = await blogService.updateBlog({
      ...blog,
      likes: blog.likes + 1,
    });

    console.log('liking blog succeeded', returnedBlog);

    const blogArray = blogs.map((blog) =>
      blog.id !== returnedBlog.id ? blog : returnedBlog
    );
    blogArray.sort((a, b) => b.likes - a.likes);
    dispatch(setBlogs(blogArray));
  };

  const removeBlog = async (blogObject) => {
    console.log('removing blog', blogObject.id);

    // eslint-disable-next-line no-alert
    const confirmation = window.confirm(`Remove blog ${blogObject.title}?`);

    if (confirmation) {
      blogService.setToken(loggedInUser.token);
      await blogService.deleteBlog(blogObject.id);

      console.log(`removing of blog ${blogObject.id} succeeded`);

      dispatch(setBlogs(blogs.filter((blog) => blog.id !== blogObject.id)));
      dispatch(
        removeUserBlog({
          username: loggedInUser.username,
          blogId: blogObject.id,
        })
      );
    } else {
      console.log(`removing of blog ${blogObject.id} was cancelled`);
    }
  };

  return (
    <Container disableGutters={true} maxWidth="xl">
      <CssBaseline />
      <Header />
      <Container>
        <Routes>
          <Route
            path="/"
            element={<HomeView likeBlog={likeBlog} removeBlog={removeBlog} />}
          />
          <Route path="/users" element={<UserListView />} />
          <Route path="/users/:id" element={<SingleUserView user={user} />} />
          <Route
            path="/blogs/:id"
            element={
              <SingleBlogView
                blog={blog}
                likeBlog={likeBlog}
                removeBlog={removeBlog}
              />
            }
          />
          <Route path="/blogs" element={<Navigate replace to="/" />} />
        </Routes>
      </Container>
    </Container>
  );
};

export default App;
