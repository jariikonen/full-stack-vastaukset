import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  message: null,
  type: null,
};

const notificationSlice = createSlice({
  name: 'notification',
  initialState,
  reducers: {
    setMessageAndType(state, action) {
      return action.payload;
    },
    clearNotification() {
      return {
        ...initialState,
      };
    },
  },
});

export const { setMessageAndType, clearNotification } =
  notificationSlice.actions;

export const setNotification = (message, type, seconds = 5) => {
  return (dispatch) => {
    dispatch(setMessageAndType({ message, type }));
    setTimeout(() => dispatch(clearNotification()), seconds * 1000);
  };
};

export default notificationSlice.reducer;
