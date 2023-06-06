import AnecdoteForm from './components/AnecdoteForm.js';
import AnecdoteList from './components/AnecdoteList.js';
import Filter from './components/Filter.js';

const App = () => {

  return (
    <div>
      <h2>Anecdotes</h2>
      <Filter />
      <AnecdoteList />
      <h2>create new</h2>
      <AnecdoteForm />
    </div>
  );
};

export default App;
