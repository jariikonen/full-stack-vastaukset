/* eslint-disable react/prop-types */
/* eslint-disable react/function-component-definition */
import React from 'react';

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

export default Notification;
