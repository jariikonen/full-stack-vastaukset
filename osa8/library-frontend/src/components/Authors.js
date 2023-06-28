import { React, useEffect } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { ALL_AUTHORS, EDIT_AUTHOR } from '../queries';

const Authors = (props) => {
  const result = useQuery(ALL_AUTHORS);
  const [editAuthor, mutationResult] = useMutation(EDIT_AUTHOR, {
    refetchQueries: [{ query: ALL_AUTHORS }],
  });

  useEffect(() => {
    if (mutationResult.data && mutationResult.data.editAuthor === null) {
      console.log('person not found');
    }
  }, [mutationResult.data]);

  if (!props.show) {
    return null;
  }

  if (result.loading) {
    return <div>loading...</div>;
  }

  const authors = result.data.allAuthors;

  const submit = (event) => {
    event.preventDefault();

    const variables = {
      name: event.target.name.value,
      born: Number(event.target.born.value),
    };
    console.log('edit author...', variables);
    editAuthor({ variables });

    event.target.name.value = authors[0].name;
    event.target.born.value = '';
  };

  return (
    <div>
      <h2>authors</h2>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>born</th>
            <th>books</th>
          </tr>
          {authors.map((a) => (
            <tr key={a.name}>
              <td>{a.name}</td>
              <td>{a.born}</td>
              <td>{a.bookCount}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {props.token && (
        <>
          <h3>Set birthyear</h3>
          <form onSubmit={submit}>
            name{' '}
            <select name="name" defaultValue={authors[0].name}>
              {authors.map((a) => (
                <option key={a.id} value={a.name}>
                  {a.name}
                </option>
              ))}
            </select>
            <div>
              born <input name="born" />
            </div>
            <button type="submit">update author</button>
          </form>
        </>
      )}
    </div>
  );
};

export default Authors;
