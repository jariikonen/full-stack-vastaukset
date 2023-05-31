/* eslint-disable react/prop-types */
/* eslint-disable react/function-component-definition */
import React from 'react';
import Blog from './Blog';

const BlogList = ({ blogs, likeBlog }) => (
  <div>
    {blogs.map((blog) => <Blog key={blog.id} blog={blog} likeBlog={likeBlog} />)}
  </div>
);

export default BlogList;
