/* eslint-disable no-console */
import { React, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Routes, Route, useMatch } from 'react-router-dom';
import { initializeBlogs } from './reducers/blogsReducer';
import { initializeLoggedInUser } from './reducers/loggedInReducer';
import { initializeUserList } from './reducers/userListReducer';
import Header from './components/Header';
import HomeView from './components/HomeView';
import UserListView from './components/UserListView';
import SingleUserView from './components/SingleUserView';

const App = () => {
  const dispatch = useDispatch();
  const match = useMatch('/users/:id');

  useEffect(() => {
    dispatch(initializeBlogs());
    dispatch(initializeLoggedInUser());
    dispatch(initializeUserList());
  }, [dispatch]);

  const userList = useSelector((state) => state.userList);
  const user = match
    ? userList.find((user) => user.id === match.params.id)
    : null;

  return (
    <div>
      <Header />
      <Routes>
        <Route path="/" element={<HomeView />} />
        <Route path="/users" element={<UserListView />} />
        <Route path="/users/:id" element={<SingleUserView user={user} />} />
      </Routes>
    </div>
  );
};

export default App;
