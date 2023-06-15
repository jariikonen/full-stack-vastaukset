import { configureStore } from '@reduxjs/toolkit';
import notificationReducer from './reducers/notificationReducer';
import blogsReducer from './reducers/blogsReducer';
import loggedInReducer from './reducers/loggedInReducer';
import userListReducer from './reducers/userListReducer';

const store = configureStore({
  reducer: {
    notification: notificationReducer,
    blogs: blogsReducer,
    loggedInUser: loggedInReducer,
    userList: userListReducer,
  },
});

export default store;
