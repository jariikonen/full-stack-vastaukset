import { useEffect, useState } from 'react';
import { useQuery } from '@apollo/client';
import { ALL_BOOKS } from '../queries';

const Recommend = ({ show, allBooksResult, allBooks, me }) => {
  const [booksToShow, setBooksToShow] = useState([]);

  const booksResult = useQuery(ALL_BOOKS, {
    onCompleted: (data) => setBooksToShow(data.allBooks),
  });

  useEffect(() => {
    if (me) {
      booksResult.refetch({ genre: me.favoriteGenre });
    }
  }, [me, allBooks]); // eslint-disable-line

  if (!show) {
    return null;
  }

  if (allBooksResult.loading || booksResult.loading) {
    return <div>loading...</div>;
  }

  return (
    <div>
      <h2>recommendations</h2>

      {me ? (
        <>
          <div>
            books in your favorite genre <b>{me.favoriteGenre}</b>
          </div>

          <table>
            <tbody>
              <tr>
                <th></th>
                <th>author</th>
                <th>published</th>
              </tr>
              {booksToShow &&
                booksToShow.map((b) => (
                  <tr key={b.title}>
                    <td>{b.title}</td>
                    <td>{b.author.name}</td>
                    <td>{b.published}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </>
      ) : (
        <div>
          to be able to recommend books for you we need to know your favorite
          genre
        </div>
      )}
    </div>
  );
};

export default Recommend;
