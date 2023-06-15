import { React, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import blogService from '../services/blogs';
import { setBlogs } from '../reducers/blogsReducer';

const Blog = ({ blog }) => {
  const [condensed, setCondensed] = useState(true);

  const blogs = useSelector((state) => state.blogs);
  const loggedInUser = useSelector((state) => state.loggedInUser);
  const dispatch = useDispatch();

  const likeBlog = async (blogObject) => {
    console.log('liking blog', blogObject);

    blogService.setToken(loggedInUser.token);
    const returnedBlog = await blogService.updateBlog(blogObject);

    console.log('liking blog succeeded', returnedBlog);

    const blogArray = blogs.map((blog) =>
      blog.id !== returnedBlog.id ? blog : returnedBlog
    );
    blogArray.sort((a, b) => b.likes - a.likes);
    dispatch(setBlogs(blogArray));
  };

  const removeBlog = async (blogObject) => {
    console.log('removing blog', blogObject.id);

    // eslint-disable-next-line no-alert
    const confirmation = window.confirm(`Remove blog ${blogObject.title}?`);

    if (confirmation) {
      blogService.setToken(loggedInUser.token);
      await blogService.deleteBlog(blogObject.id);

      console.log(`removing of blog ${blogObject.id} succeeded`);

      dispatch(setBlogs(blogs.filter((blog) => blog.id !== blogObject.id)));
    } else {
      console.log(`removing of blog ${blogObject.id} was cancelled`);
    }
  };

  const toggleSize = () => {
    setCondensed(!condensed);
  };

  const handleLike = () => {
    likeBlog({
      ...blog,
      user: blog.user.id,
      likes: blog.likes + 1,
    });
  };

  const blogStyle = {
    paddingLeft: 8,
    paddingRight: 8,
    paddingTop: 5,
    paddingBottom: 5,
    marginTop: 8,
    marginBottom: 8,
    background: '#E0EEEE',
  };

  if (condensed) {
    return (
      <div className="blog" style={blogStyle}>
        {blog.title} {blog.author}{' '}
        <button type="button" onClick={toggleSize}>
          view
        </button>
      </div>
    );
  }

  return (
    <div className="blog" style={blogStyle}>
      <div>
        {blog.title} {blog.author}{' '}
        <button type="button" onClick={toggleSize}>
          hide
        </button>
      </div>
      <div>{blog.url}</div>
      <div>
        likes {blog.likes}{' '}
        <button type="button" onClick={handleLike}>
          like
        </button>
      </div>
      <div>{blog.user.name}</div>
      {loggedInUser.username === blog.user.username && (
        <button type="button" onClick={() => removeBlog(blog)}>
          remove
        </button>
      )}
    </div>
  );
};

export default Blog;
