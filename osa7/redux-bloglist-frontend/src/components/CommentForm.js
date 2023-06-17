import { useSelector, useDispatch } from 'react-redux';
import blogService from '../services/blogs';
import { appendBlogComment } from '../reducers/blogsReducer';
import { setUserBlog } from '../reducers/userListReducer';

const CommentForm = ({ blogId }) => {
  const loggedInUser = useSelector((state) => state.loggedInUser);
  const dispatch = useDispatch();

  const addComment = async (event) => {
    event.preventDefault();
    const comment = event.target.comment.value;

    blogService.setToken(loggedInUser.token);
    const returnedBlog = await blogService.appendComment(blogId, comment);

    dispatch(appendBlogComment({ blogId: returnedBlog.id, comment }));
    dispatch(
      setUserBlog({ username: returnedBlog.user.username, blog: returnedBlog })
    );

    event.target.comment.value = '';
  };

  return (
    <form onSubmit={addComment}>
      <input name="comment" />
      <button type="submit">add comment</button>
    </form>
  );
};

export default CommentForm;
