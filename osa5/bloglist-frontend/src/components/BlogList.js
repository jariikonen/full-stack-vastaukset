/* eslint-disable react/prop-types */
/* eslint-disable react/function-component-definition */
import React from 'react';
import Blog from './Blog';

const BlogList = ({ blogs }) => (
  <div>
    {blogs.map((blog) => <Blog key={blog.id} blog={blog} />)}
  </div>
);

export default BlogList;
