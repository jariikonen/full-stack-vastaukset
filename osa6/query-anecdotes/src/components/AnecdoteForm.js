import { useMutation, useQueryClient } from 'react-query';
import { createAnecdote } from '../requests';
import { useNotificationDispatch, setNotification, clearNotification } from '../NotificationContext';

const AnecdoteForm = () => {
  const queryClient =  useQueryClient();
  const dispatch = useNotificationDispatch();

  const newAnecdoteMutation = useMutation(createAnecdote, {
    onSuccess: (newAnecdote) => {
      const anecdotes = queryClient.getQueryData('anecdotes');
      queryClient.setQueryData('anecdotes', anecdotes.concat(newAnecdote));
    },
    onError: () => {
      dispatch(setNotification('too short anecdote - anecdote must be at least 5 characters long'));
      setTimeout(() => dispatch(clearNotification()), 5000);
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
    dispatch(setNotification(`new anecdote '${content}' created`));
    setTimeout(() => dispatch(clearNotification()), 5000);
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
