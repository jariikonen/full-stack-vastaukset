import { createSlice } from '@reduxjs/toolkit';
import blogService from '../services/blogs';

const blogsSlice = createSlice({
  name: 'blogs',
  initialState: [],
  reducers: {
    appendBlog(state, action) {
      state.push(action.payload);
    },
    setBlogs(state, action) {
      return action.payload;
    },
  },
});

export const { appendBlog, setBlogs } = blogsSlice.actions;

export const initializeBlogs = () => {
  return async (dispatch) => {
    const receivedBlogs = await blogService.getAll();
    receivedBlogs.sort((a, b) => b.likes - a.likes);
    console.log('initializing blogs:', receivedBlogs);
    dispatch(setBlogs(receivedBlogs));
  };
};

export default blogsSlice.reducer;
