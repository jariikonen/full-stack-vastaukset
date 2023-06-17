import { useSelector } from 'react-redux';
import CommentForm from './CommentForm';

const SingleBlogView = ({ blog, likeBlog, removeBlog }) => {
  const loggedInUser = useSelector((state) => state.loggedInUser);

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
          <button type="button" onClick={() => likeBlog(blog)}>
            like
          </button>
        </div>
        <div style={rowStyle}>Added by {blog.user.name}</div>
        {loggedInUser.username === blog.user.username && (
          <button
            style={rowStyle}
            type="button"
            onClick={() => removeBlog(blog)}
          >
            remove
          </button>
        )}
        <h4>comments</h4>
        <CommentForm blogId={blog.id} />
        <ul>
          {blog.comments.map((comment, index) => (
            <li key={index} style={rowStyle}>
              {comment}
            </li>
          ))}
        </ul>
      </div>
    );
  }
};

export default SingleBlogView;
