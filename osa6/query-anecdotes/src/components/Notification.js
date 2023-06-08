import { useNotificationText } from '../NotificationContext';

const Notification = () => {
  const style = {
    border: 'solid',
    padding: 10,
    borderWidth: 1,
    marginBottom: 5,
  };

  const text = useNotificationText();
  if (!text) return null;

  return (
    <div style={style}>
      {text}
    </div>
  )
}

export default Notification
