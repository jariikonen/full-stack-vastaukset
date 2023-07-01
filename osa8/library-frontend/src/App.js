import { useEffect, useState } from 'react';
import { useApolloClient, useQuery, useSubscription } from '@apollo/client';
import { ALL_BOOKS, ME, BOOK_ADDED, ALL_AUTHORS } from './queries';
import Authors from './components/Authors';
import Books from './components/Books';
import NewBook from './components/NewBook';
import LoginForm from './components/LoginForm';
import Error from './components/Error';
import Recommend from './components/Recommend';

const App = () => {
  const [page, setPage] = useState('authors');
  const [token, setToken] = useState(null);
  const [error, setError] = useState(null);
  const client = useApolloClient();
  const [allBooks, setAllBooks] = useState([]);
  const [me, setMe] = useState(null);

  const allBooksResult = useQuery(ALL_BOOKS, {
    onCompleted: (data) => {
      setAllBooks(data.allBooks);
    },
  });

  useQuery(ME, {
    pollInterval: 2000,
    onCompleted: (data) => {
      if (!me && data.me) {
        console.log('setting me:', data.me);
        setMe(data.me);
      }
    },
  });

  useEffect(() => {
    if (!token) {
      const tokenFromLS = window.localStorage.getItem('library-user-token');
      if (tokenFromLS) {
        setToken(tokenFromLS);
        console.log(`logged in with token ${tokenFromLS}`);
      } else {
        console.log('not logged in');
      }
    }
  }, [token]);

  const updateAuthorCache = (cache, query, author) => {
    // helper that is used to eliminate saving same author twice
    const uniqByName = (a) => {
      let seen = new Set();
      return a.filter((item) => {
        let k = item.name;
        return seen.has(k) ? false : seen.add(k);
      });
    };

    cache.updateQuery(query, ({ allAuthors }) => {
      return {
        allAuthors: uniqByName(allAuthors.concat(author)),
      };
    });
  };

  useSubscription(BOOK_ADDED, {
    onData: ({ data }) => {
      const addedBook = data.data.bookAdded;
      data = null;

      client.cache.updateQuery({ query: ALL_BOOKS }, ({ allBooks }) => {
        return {
          allBooks: allBooks.concat(addedBook),
        };
      });

      updateAuthorCache(client.cache, { query: ALL_AUTHORS }, addedBook.author);

      window.alert(
        `New book added!\n${addedBook.title}\nby ${addedBook.author.name}`
      );
    },
  });

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
    setMe(null);
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
            <button onClick={() => setPage('recommend')}>recommend</button>
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

      <Books
        show={page === 'books'}
        allBooksResult={allBooksResult}
        allBooks={allBooks}
      />

      <NewBook
        show={page === 'add'}
        displayError={displayError}
        setPage={setPage}
      />

      <Recommend
        show={page === 'recommend'}
        allBooksResult={allBooksResult}
        allBooks={allBooks}
        me={me}
      />
    </div>
  );
};

export default App;
