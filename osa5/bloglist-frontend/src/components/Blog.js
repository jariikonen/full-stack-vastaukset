/* eslint-disable no-console */
/* eslint-disable react/prop-types */
/* eslint-disable react/function-component-definition */
import { React, useState } from 'react';

const Blog = ({ blog }) => {
  const [condensed, setCondensed] = useState(true);

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
      <div style={blogStyle}>
        {blog.title}
        {' '}
        {blog.author}
        {' '}
        <button type="button" onClick={toggleSize}>view</button>
      </div>
    );
  }

  return (
    <div style={blogStyle}>
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
        <button type="button" onClick={() => console.log('like button clicked')}>like</button>
      </div>
      <div>{blog.user.name}</div>
    </div>
  );
};

export default Blog;
