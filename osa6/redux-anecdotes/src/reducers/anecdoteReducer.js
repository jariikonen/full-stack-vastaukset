import { createSlice } from "@reduxjs/toolkit";
import anecdoteService from "../services/anecdotes";

const anecdoteSlice = createSlice({
  name: 'anecdotes',
  initialState: [],
  reducers: {
    appendAnecdote(state, action) {
      state.push(action.payload);
    },
    setAnecdotes(state, action) {
      return action.payload;
    },
  }
});

export const { appendAnecdote, setAnecdotes } = anecdoteSlice.actions;

export const initializeAnecdotes = () => {
  return async (dispatch) => {
    const anecdotes = await anecdoteService.getAll();
    dispatch(setAnecdotes(anecdotes));
  };
};

export const createAnecdote = (content) => {
  return async (dispatch) => {
    const newAnecdote = await anecdoteService.createNew(content);
    dispatch(appendAnecdote(newAnecdote));
  };
};

export const voteAnecdote = (id) => {
  return async (dispatch, getState) => {
    const state = getState();
    const anecdoteToChange = state.anecdotes.find((anecdote) => anecdote.id === id);
    const changedAnecdote = {
      ...anecdoteToChange,
      votes: anecdoteToChange.votes + 1,
    };
    const updatedAnecdote = await anecdoteService.updateAnecdote(changedAnecdote);
    dispatch(setAnecdotes(state.anecdotes.map((anecdote) =>
      anecdote.id !== id ? anecdote : updatedAnecdote
    )));
  };
};

export default anecdoteSlice.reducer;
