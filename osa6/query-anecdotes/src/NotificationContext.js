import { createContext, useReducer, useContext } from 'react';

const notificationReducer = (state, action) => {
  switch (action.type) {
    case 'SET_TEXT':
        return action.payload;
    case 'CLEAR_TEXT':
        return null;
    default:
        return state;
  };
};

const NotificationContext = createContext();

export const useNotificationText = () => {
  const textAndDispatch = useContext(NotificationContext);
  return textAndDispatch[0];
};

export const useNotificationDispatch = () => {
  const textAndDispatch = useContext(NotificationContext);
  return textAndDispatch[1];
};

export const setNotification = (text) => {
  return {
    type: 'SET_TEXT',
    payload: text,
  };
};

export const clearNotification = () => {
  return {
    type: 'CLEAR_TEXT',
  };
};

export const NotificationContextProvider = (props) => {
  const [notificationText, notificationDispatch] = useReducer(notificationReducer, null);

  return (
    <NotificationContext.Provider value={[notificationText, notificationDispatch]}>
      {props.children}
    </NotificationContext.Provider>
  );
};

export default NotificationContext;
