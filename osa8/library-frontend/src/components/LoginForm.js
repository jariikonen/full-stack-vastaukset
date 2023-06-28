import { React, useEffect } from 'react';
import { useMutation } from '@apollo/client';
import { LOGIN } from '../queries';

const LoginForm = ({ show, setToken, displayError, setPage }) => {
  const [login, result] = useMutation(LOGIN, {
    onError: (error) => {
      displayError(error.graphQLErrors[0].message);
    },
  });

  useEffect(() => {
    if (result.data) {
      const token = result.data.login.value;
      setToken(token);
      localStorage.setItem('library-user-token', token);
    }
  }, [result.data]); // eslint-disable-line

  if (!show) {
    return null;
  }

  const submit = async (event) => {
    event.preventDefault();
    const username = event.target.username.value;
    const password = event.target.password.value;

    login({ variables: { username, password } });

    setPage('authors');
  };

  return (
    <div>
      <form onSubmit={submit}>
        <div>
          username <input name="username" />
        </div>
        <div>
          password <input type="password" name="password" />
        </div>
        <button type="submit">login</button>
      </form>
    </div>
  );
};

export default LoginForm;
