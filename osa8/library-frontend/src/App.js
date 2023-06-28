import { useEffect, useState } from 'react';
import { useApolloClient } from '@apollo/client';
import Authors from './components/Authors';
import Books from './components/Books';
import NewBook from './components/NewBook';
import LoginForm from './components/LoginForm';
import Error from './components/Error';

const App = () => {
  const [page, setPage] = useState('authors');
  const [token, setToken] = useState(null);
  const [error, setError] = useState(null);
  const client = useApolloClient();

  useEffect(() => {
    if (!token) {
      const tokenFromStorage =
        window.localStorage.getItem('library-user-token');
      if (tokenFromStorage) {
        setToken(tokenFromStorage);
        console.log(`App: useEffect: logged in with token ${tokenFromStorage}`);
      } else {
        console.log('App: useEffect: not logged in');
      }
    }
  }, [token]);

  const displayError = (message) => {
    setError(message);
    setTimeout(() => {
      setError(null);
    }, 10000);
  };

  const logout = () => {
    setToken(null);
    localStorage.clear();
    client.resetStore();
    setPage('authors');
  };

  return (
    <div>
      <div>
        <button onClick={() => setPage('authors')}>authors</button>
        <button onClick={() => setPage('books')}>books</button>
        {token && (
          <>
            <button onClick={() => setPage('add')}>add book</button>
            <button onClick={logout}>logout</button>
          </>
        )}
        {!token && <button onClick={() => setPage('login')}>login</button>}
      </div>

      <Error message={error} />

      <LoginForm
        show={page === 'login'}
        setToken={setToken}
        displayError={displayError}
        setPage={setPage}
      />

      <Authors show={page === 'authors'} token={token} />

      <Books show={page === 'books'} />

      <NewBook
        show={page === 'add'}
        displayError={displayError}
        setPage={setPage}
      />
    </div>
  );
};

export default App;
