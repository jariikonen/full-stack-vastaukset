import React from 'react';
import { useSelector } from 'react-redux';
import Blog from './Blog';

const BlogList = ({ likeBlog, removeBlog }) => {
  const blogs = useSelector((state) => state.blogs);

  return (
    <div>
      {blogs.map((blog) => (
        <Blog
          key={blog.id}
          blog={blog}
          likeBlog={likeBlog}
          removeBlog={removeBlog}
        />
      ))}
    </div>
  );
};

export default BlogList;
