import { createContext, useReducer, useContext } from 'react';

const notificationReducer = (state, action) => {
  switch (action.type) {
    case 'SET':
        return action.payload;
    case 'CLEAR':
        return null;
    default:
        return state;
  };
};

const NotificationContext = createContext();

export const useNotificationText = () => {
  const [text] = useContext(NotificationContext);
  return text;
};

export const useNotificationDispatch = () => {
  const textAndDispatch = useContext(NotificationContext);
  return textAndDispatch[1];
};

export const setNotification = (text) => {
  return {
    type: 'SET',
    payload: text,
  };
};

export const clearNotification = () => {
  return {
    type: 'CLEAR',
  };
};

// päivitin sovelluksen käyttämään uuden anekdootin tallennuksessa tätä tehtävän mallivastauksen
// pohjalta tehtyä custom hookia
export const useNotification = () => {
  const textAndDispatch = useContext(NotificationContext);
  const dispatch = textAndDispatch[1];
  return (payload) => {
    dispatch({ type: 'SET', payload });
    setTimeout(() => dispatch({ type: 'CLEAR'}), 5000);
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
