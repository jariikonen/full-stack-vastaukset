import React from 'react';

const Error = ({ message }) => {
  if (!message) {
    return null;
  }

  return <div style={{ color: 'red' }}>{message}</div>;
};

export default Error;
