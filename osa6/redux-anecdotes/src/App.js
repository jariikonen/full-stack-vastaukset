import AnecdoteForm from './components/AnecdoteForm.js';
import AnecdoteList from './components/AnecdoteList.js';

const App = () => {

  return (
    <div>
      <h2>Anecdotes</h2>
      <AnecdoteList />
      <h2>create new</h2>
      <AnecdoteForm />
    </div>
  );
};

export default App;
