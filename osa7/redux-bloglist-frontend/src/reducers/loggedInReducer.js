import { createSlice } from '@reduxjs/toolkit';

const userSlice = createSlice({
  name: 'loggedInUser',
  initialState: null,
  reducers: {
    setLoggedInUser(state, action) {
      return action.payload;
    },
  },
});

export const { setLoggedInUser } = userSlice.actions;

export const initializeLoggedInUser = () => {
  return async (dispatch) => {
    const loggedUserJSON = window.localStorage.getItem('loggedBloglistUser');
    if (loggedUserJSON) {
      const usr = JSON.parse(loggedUserJSON);
      console.log(
        'initializing loggedInUser from local storage with following object:',
        usr
      );
      dispatch(setLoggedInUser(usr));
    }
    console.log('initializeLoggedInUser: not logged in');
  };
};

export default userSlice.reducer;
