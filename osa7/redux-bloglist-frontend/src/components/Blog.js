import { React, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

const Blog = ({ blog, likeBlog, removeBlog }) => {
  const [condensed, setCondensed] = useState(true);

  const loggedInUser = useSelector((state) => state.loggedInUser);

  const toggleSize = () => {
    setCondensed(!condensed);
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
        <Link to={`/blogs/${blog.id}`}>
          {blog.title} {blog.author}
        </Link>{' '}
        <button type="button" onClick={toggleSize}>
          view
        </button>
      </div>
    );
  }

  return (
    <div className="blog" style={blogStyle}>
      <div>
        <Link to={`/blogs/${blog.id}`}>
          {blog.title} {blog.author}
        </Link>{' '}
        <button type="button" onClick={toggleSize}>
          hide
        </button>
      </div>
      <div>{blog.url}</div>
      <div>
        likes {blog.likes}{' '}
        <button type="button" onClick={() => likeBlog(blog)}>
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
