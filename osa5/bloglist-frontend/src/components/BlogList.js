import React from 'react';
import PropTypes from 'prop-types';
import Blog from './Blog';

const BlogList = ({
  blogs,
  likeBlog,
  removeBlog,
  user,
}) => (
  <div>
    {blogs.map((blog) => (
      <Blog
        key={blog.id}
        blog={blog}
        likeBlog={likeBlog}
        removeBlog={removeBlog}
        user={user}
      />
    ))}
  </div>
);

BlogList.propTypes = {
  blogs: PropTypes.arrayOf((propValue, key, componentName, location, propFullName) => {
    const objectKeys = Object.keys(propValue[key]);
    const targetKeys = ['author', 'id', 'likes', 'title', 'url', 'user'];
    const checker = (arr, target) => target.every((v) => arr.includes(v));
    if (!checker(objectKeys, targetKeys)) {
      return new Error(
        `Invalid prop '${propFullName}' supplied to ${componentName}. Missing key(s). `
        + `Required keys are '${targetKeys.join('\', \'')}'. Validation failed.`,
      );
    }

    if (typeof propValue[key].author !== 'string') {
      return new Error(
        `Invalid prop '${propFullName}' supplied to ${componentName}. `
        + 'Field \'author\' is not a string. Validation failed.',
      );
    }
    if (typeof propValue[key].id !== 'string') {
      return new Error(
        `Invalid prop '${propFullName}' supplied to ${componentName}. `
        + 'Field \'id\' is not a string. Validation failed.',
      );
    }
    if (typeof propValue[key].likes !== 'number') {
      return new Error(
        `Invalid prop '${propFullName}' supplied to ${componentName}. `
        + 'Field \'likes\' is not a number. Validation failed.',
      );
    }
    if (typeof propValue[key].title !== 'string') {
      return new Error(
        `Invalid prop '${propFullName}' supplied to ${componentName}. `
        + 'Field \'title\' is not a string. Validation failed.',
      );
    }
    if (typeof propValue[key].url !== 'string') {
      return new Error(
        `Invalid prop '${propFullName}' supplied to ${componentName}. `
        + 'Field \'url\' is not a string. Validation failed.',
      );
    }
    if (typeof propValue[key].user !== 'object') {
      return new Error(
        `Invalid prop '${propFullName}' supplied to ${componentName}. `
        + 'Field \'user\' is not an object. Validation failed.',
      );
    }
    return null;
  }).isRequired,
  likeBlog: PropTypes.func.isRequired,
  removeBlog: PropTypes.func.isRequired,
  user: PropTypes.shape({
    name: PropTypes.string.isRequired,
    token: PropTypes.string.isRequired,
    username: PropTypes.string.isRequired,
  }).isRequired,
};

export default BlogList;
