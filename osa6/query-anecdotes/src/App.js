import { useQuery } from 'react-query';
import axios from 'axios';
import AnecdoteForm from './components/AnecdoteForm';
import Notification from './components/Notification';

const App = () => {

  const result = useQuery(
    'anecdotes',
    () => axios.get('http://localhost:3001/anecdotes').then(res => res.data),
    {
      retry: 1, // vain yksi uudelleenyritys
    },
  );
  console.log(result);

  const handleVote = (anecdote) => {
    console.log('vote');
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
