import { React, useRef } from 'react';
import { useSelector } from 'react-redux';
import BlogList from './BlogList';
import CreateBlogForm from './CreateBlogForm';
import Togglable from './Togglable';

const HomeView = () => {
  const blogFormRef = useRef();
  const loggedInUser = useSelector((state) => state.loggedInUser);

  if (loggedInUser) {
    return (
      <div>
        <Togglable buttonLabel="create blog" ref={blogFormRef}>
          <CreateBlogForm blogFormRef={blogFormRef} />
        </Togglable>
        <BlogList />
      </div>
    );
  }
};

export default HomeView;
