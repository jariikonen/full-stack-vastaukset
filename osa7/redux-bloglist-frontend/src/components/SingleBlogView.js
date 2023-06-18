import { useSelector } from 'react-redux';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Blog from './Blog';
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
        <Blog blog={blog} likeBlog={likeBlog} removeBlog={removeBlog} />
        <h4>Comments</h4>
        <CommentForm blogId={blog.id} />
        <List dense>
          {blog.comments.map((comment, index) => (
            <ListItem key={index} style={rowStyle}>
              {comment}
            </ListItem>
          ))}
        </List>
      </div>
    );
  }
};

export default SingleBlogView;
