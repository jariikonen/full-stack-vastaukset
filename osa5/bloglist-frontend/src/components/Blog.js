import { React, useState } from 'react';
import PropTypes from 'prop-types';

const Blog = ({
  blog,
  likeBlog,
  removeBlog,
  user,
}) => {
  const [condensed, setCondensed] = useState(true);

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
        {blog.title}
        {' '}
        {blog.author}
        {' '}
        <button type="button" onClick={toggleSize}>view</button>
      </div>
    );
  }

  return (
    <div className="blog" style={blogStyle}>
      <div>
        {blog.title}
        {' '}
        {blog.author}
        {' '}
        <button type="button" onClick={toggleSize}>hide</button>
      </div>
      <div>{blog.url}</div>
      <div>
        likes
        {' '}
        {blog.likes}
        {' '}
        <button type="button" onClick={handleLike}>like</button>
      </div>
      <div>{blog.user.name}</div>
      {user.username === blog.user.username
        && <button type="button" onClick={() => removeBlog(blog)}>remove</button>}
    </div>
  );
};

Blog.propTypes = {
  blog: PropTypes.shape({
    author: PropTypes.string.isRequired,
    id: PropTypes.string.isRequired,
    likes: PropTypes.number.isRequired,
    title: PropTypes.string.isRequired,
    url: PropTypes.string.isRequired,
    user: PropTypes.shape({
      username: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      id: PropTypes.string.isRequired,
    }),
  }).isRequired,
  likeBlog: PropTypes.func.isRequired,
  removeBlog: PropTypes.func.isRequired,
  user: PropTypes.shape({
    name: PropTypes.string.isRequired,
    token: PropTypes.string.isRequired,
    username: PropTypes.string.isRequired,
  }).isRequired,
};

export default Blog;
