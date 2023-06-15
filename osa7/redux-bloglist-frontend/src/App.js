/* eslint-disable no-console */
import { React, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { initializeBlogs } from './reducers/blogsReducer';
import { initializeLoggedInUser } from './reducers/loggedInReducer';
import { initializeUserList } from './reducers/userListReducer';
import Header from './components/Header';
import HomeView from './components/HomeView';
import UserListView from './components/UserListView';

const App = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(initializeBlogs());
    dispatch(initializeLoggedInUser());
    dispatch(initializeUserList());
  }, [dispatch]);

  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<HomeView />} />
        <Route path="users" element={<UserListView />} />
      </Routes>
    </Router>
  );
};

export default App;
