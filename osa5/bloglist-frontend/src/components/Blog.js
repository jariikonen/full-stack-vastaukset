/* eslint-disable react/prop-types */
/* eslint-disable react/function-component-definition */
import React from 'react';

const Blog = ({ blog }) => (
  <div>
    {blog.title}
    {' '}
    {blog.author}
  </div>
);

export default Blog;
