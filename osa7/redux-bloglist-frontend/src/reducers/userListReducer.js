import { createSlice } from '@reduxjs/toolkit';
import usersService from '../services/users';

const userListSlice = createSlice({
  name: 'userList',
  initialState: [],
  reducers: {
    setUserList(state, action) {
      return action.payload;
    },
  },
});

export const { setUserList } = userListSlice.actions;

export const initializeUserList = () => {
  return async (dispatch) => {
    const receivedUsers = await usersService.getAll();
    console.log('initializing users:', receivedUsers);
    dispatch(setUserList(receivedUsers));
  };
};

export default userListSlice.reducer;
