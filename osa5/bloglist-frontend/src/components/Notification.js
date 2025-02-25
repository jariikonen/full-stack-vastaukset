import React from 'react';
import PropTypes from 'prop-types';

const Notification = ({ message, type }) => {
  if (message === null) {
    return null;
  }

  return (
    <div className={type}>
      {message}
    </div>
  );
};

Notification.defaultProps = {
  message: null,
  type: null,
};

Notification.propTypes = {
  message: PropTypes.string,
  type: PropTypes.string,
};

export default Notification;
