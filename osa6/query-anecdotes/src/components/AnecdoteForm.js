import { useMutation, useQueryClient } from 'react-query';
import { createAnecdote } from '../requests';
import { useNotification } from '../NotificationContext';

const AnecdoteForm = () => {
  const queryClient =  useQueryClient();
  // mallivastauksen pohjalta tehtyä viestin näyttävää custom hookia käytetään näin,
  // ottamalla hookin palauttama funktio muuttujaan notifyWith
  const notifyWith = useNotification();

  const newAnecdoteMutation = useMutation(createAnecdote, {
    onSuccess: (newAnecdote) => {
      const anecdotes = queryClient.getQueryData('anecdotes');
      queryClient.setQueryData('anecdotes', anecdotes.concat(newAnecdote));
    },
    // mallivastauksen pohjalta päivitin myös virheenkäsittelijän käyttämään react-query:ltä
    // saatua virheviestiä
    onError: (error) => {
      notifyWith(error.response.data.error);
    }
  });

  const onCreate = (event) => {
    event.preventDefault();
    const content = event.target.anecdote.value;
    event.target.anecdote.value = '';
    console.log(`new anecdote '${content}' created`);
    newAnecdoteMutation.mutate({
      content,
      votes: 0,
    });
    notifyWith(`new anecdote '${content}' created`);
}

  return (
    <div>
      <h3>create new</h3>
      <form onSubmit={onCreate}>
        <input name='anecdote' />
        <button type="submit">create</button>
      </form>
    </div>
  );
};

export default AnecdoteForm;
