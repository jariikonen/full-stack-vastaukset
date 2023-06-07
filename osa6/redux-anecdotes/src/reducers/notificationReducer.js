import { createSlice } from "@reduxjs/toolkit";

const notificationSlice = createSlice({
  name: 'notification',
  initialState: null,
  reducers: {
    setNotificationText(state, action) {
      return action.payload;
    },
    clearNotificationText(state, action) {
      return null;
    },
  },
});

export const { setNotificationText, clearNotificationText } = notificationSlice.actions;

export const setNotification = (text, seconds) => {
  return (dispatch) => {
    dispatch(setNotificationText(text));
    setTimeout(() => dispatch(clearNotificationText()), seconds * 1000);
  };
};

export default notificationSlice.reducer;
