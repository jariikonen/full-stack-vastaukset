import { useQuery, useMutation, useQueryClient } from 'react-query';
import { getAnecdotes, updateAnecdote } from './requests';
import AnecdoteForm from './components/AnecdoteForm';
import Notification from './components/Notification';

const App = () => {
  const queryClient =  useQueryClient();

  const voteAnecdoteMutation = useMutation(updateAnecdote, {
    onSuccess: (updatedAnecdote) => {
      const anecdotes = queryClient.getQueryData('anecdotes');
      const updatedAnecdotes = anecdotes.map(
        (anecdote) =>
          anecdote.id !== updatedAnecdote.id
            ? anecdote
            : updatedAnecdote
        );
      queryClient.setQueryData('anecdotes', updatedAnecdotes);
    },
  });

  const result = useQuery(
    'anecdotes',
    getAnecdotes,
    {
      retry: 1, // vain yksi uudelleenyritys
    },
  );
  console.log(result);

  const handleVote = (anecdote) => {
    console.log(`vote '${anecdote.content}' (id: '${anecdote.id}')`);
    voteAnecdoteMutation.mutate({
      ...anecdote,
      votes: anecdote.votes + 1,
    });
  };

  if (result.isLoading) {
    return <div>loading data...</div>
  };

  if (result.isError) {
    return <div>anecdote service not available due to problems in server</div>
  };

  const anecdotes = result.data;

  return (
    <div>
      <h3>Anecdote app</h3>

      <Notification />
      <AnecdoteForm />

      {anecdotes.map(anecdote =>
        <div key={anecdote.id}>
          <div>
            {anecdote.content}
          </div>
          <div>
            has {anecdote.votes}
            <button onClick={() => handleVote(anecdote)}>vote</button>
          </div>
        </div>
      )}
    </div>
  )
}

export default App;
