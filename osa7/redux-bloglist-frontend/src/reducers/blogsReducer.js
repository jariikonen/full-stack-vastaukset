import { createSlice } from '@reduxjs/toolkit';
import blogService from '../services/blogs';

const blogsSlice = createSlice({
  name: 'blogs',
  initialState: [],
  reducers: {
    appendBlog(state, action) {
      state.push(action.payload);
    },
    appendBlogComment(state, action) {
      const { blogId, comment } = action.payload;
      const blogToChange = state.find((blog) => blog.id === blogId);
      const newBlog = {
        ...blogToChange,
        comments: blogToChange.comments.concat(comment),
      };
      return state.map((blog) =>
        blog.id !== blogToChange.id ? blog : newBlog
      );
    },
    setBlogs(state, action) {
      return action.payload;
    },
  },
});

export const { appendBlog, appendBlogComment, setBlogs } = blogsSlice.actions;

export const initializeBlogs = () => {
  return async (dispatch) => {
    const receivedBlogs = await blogService.getAll();
    receivedBlogs.sort((a, b) => b.likes - a.likes);
    console.log('initializing blogs:', receivedBlogs);
    dispatch(setBlogs(receivedBlogs));
  };
};

export default blogsSlice.reducer;
