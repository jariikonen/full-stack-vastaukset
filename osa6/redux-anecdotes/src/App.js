import AnecdoteForm from './components/AnecdoteForm.js';
import AnecdoteList from './components/AnecdoteList.js';
import Filter from './components/Filter.js';
import Notification from './components/Notification.js';

const App = () => {

  return (
    <div>
      <h2>Anecdotes</h2>
      <Filter />
      <Notification />
      <AnecdoteList />
      <h2>create new</h2>
      <AnecdoteForm />
    </div>
  );
};

export default App;
