import { useEffect, useState } from 'react';
import { useQuery } from '@apollo/client';
import { ALL_BOOKS } from '../queries';

const Books = (props) => {
  const [allBooks, setAllBooks] = useState([]);
  const [booksToShow, setBooksToShow] = useState([]);
  const [genres, setGenres] = useState([]);

  const allBooksResult = useQuery(ALL_BOOKS, {
    onCompleted: (data) => setAllBooks(data.allBooks),
  });
  const filteredBooksResult = useQuery(ALL_BOOKS, {
    onCompleted: (data) => setBooksToShow(data.allBooks),
  });

  useEffect(() => {
    setGenres(
      allBooks
        .reduce(
          (accumulator, book) => [...new Set([...accumulator, ...book.genres])],
          []
        )
        .concat(['all genres'])
    );
    setBooksToShow(allBooks);
  }, [allBooks]);

  if (!props.show) {
    return null;
  }

  if (allBooksResult.loading || filteredBooksResult.loading) {
    return <div>loading...</div>;
  }

  const queryFilteredBooks = (filterBy) => {
    if (filterBy === 'all genres') {
      allBooksResult.refetch();
      setBooksToShow(allBooks);
    } else {
      filteredBooksResult.refetch({ genre: filterBy });
    }
  };

  return (
    <div>
      <h2>books</h2>

      <table>
        <tbody>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
          </tr>
          {booksToShow &&
            booksToShow.map((a) => (
              <tr key={a.title}>
                <td>{a.title}</td>
                <td>{a.author.name}</td>
                <td>{a.published}</td>
              </tr>
            ))}
        </tbody>
      </table>
      {genres.map((g) => (
        <button key={g} onClick={() => queryFilteredBooks(g)}>
          {g}
        </button>
      ))}
    </div>
  );
};

export default Books;
