/* eslint-disable react/prop-types */
/* eslint-disable react/function-component-definition */
import React from 'react';

const LoginForm = ({
  handleLogin,
  username,
  handleUsernameChange,
  password,
  handlePasswordChange,
}) => (
  <div>
    <form onSubmit={handleLogin}>
      <div>
        username
        {' '}
        <input
          type="text"
          value={username}
          name="Username"
          onChange={handleUsernameChange}
        />
      </div>
      <div>
        password
        {' '}
        <input
          type="password"
          value={password}
          name="Password"
          onChange={handlePasswordChange}
        />
      </div>
      <button type="submit">login</button>
    </form>
  </div>
);

export default LoginForm;
