import { createSlice } from '@reduxjs/toolkit';
import usersService from '../services/users';

const userListSlice = createSlice({
  name: 'userList',
  initialState: [],
  reducers: {
    setUserList(state, action) {
      return action.payload;
    },
    appendUserBlog(state, action) {
      const { username, blog } = action.payload;
      // eslint-disable-next-line no-unused-vars
      const { user, likes, ...blogToAppend } = blog;
      const userToChange = state.find((user) => user.username === username);
      const newUser = {
        ...userToChange,
        blogs: userToChange.blogs.concat(blogToAppend),
      };
      return state.map((usr) => (usr.id !== userToChange.id ? usr : newUser));
    },
    removeUserBlog(state, action) {
      const { username, blogId } = action.payload;
      const userToChange = state.find((user) => user.username === username);
      const newUser = {
        ...userToChange,
        blogs: userToChange.blogs.filter((blog) => blog.id !== blogId),
      };
      return state.map((usr) => (usr.id !== userToChange.id ? usr : newUser));
    },
  },
});

export const { setUserList, appendUserBlog, removeUserBlog } =
  userListSlice.actions;

export const initializeUserList = () => {
  return async (dispatch) => {
    const receivedUsers = await usersService.getAll();
    console.log('initializing users:', receivedUsers);
    dispatch(setUserList(receivedUsers));
  };
};

export default userListSlice.reducer;
