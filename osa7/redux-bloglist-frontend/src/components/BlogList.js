import React from 'react';
import { useSelector } from 'react-redux';
import BlogAccordion from './BlogAccordion';

const BlogList = ({ likeBlog, removeBlog }) => {
  const blogs = useSelector((state) => state.blogs);

  return (
    <div style={{ marginTop: 10, marginBottom: 10 }}>
      {blogs.map((blog) => (
        <BlogAccordion
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
