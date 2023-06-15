import { useSelector } from 'react-redux';

const SingleBlogView = ({ blog, likeBlog, removeBlog }) => {
  const loggedInUser = useSelector((state) => state.loggedInUser);

  const handleLike = () => {
    likeBlog({
      ...blog,
      user: blog.user.id,
      likes: blog.likes + 1,
    });
  };

  const rowStyle = {
    paddingLeft: 5,
    marginBottom: 5,
  };

  if (loggedInUser && blog) {
    return (
      <div>
        <h2>{blog.title}</h2>
        <div style={rowStyle}>
          <a href={blog.url}>{blog.url}</a>
        </div>
        <div style={rowStyle}>
          {blog.likes} likes{' '}
          <button type="button" onClick={handleLike}>
            like
          </button>
        </div>
        <div style={rowStyle}>{blog.user.name}</div>
        {loggedInUser.username === blog.user.username && (
          <button
            style={rowStyle}
            type="button"
            onClick={() => removeBlog(blog)}
          >
            remove
          </button>
        )}
      </div>
    );
  }
};

export default SingleBlogView;
