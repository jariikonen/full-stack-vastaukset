import { React } from 'react';
import { useSelector } from 'react-redux';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import ThumbUp from '@mui/icons-material/ThumbUp';
import Link from '@mui/material/Link';

const Blog = ({ blog, likeBlog, removeBlog }) => {
  const loggedInUser = useSelector((state) => state.loggedInUser);

  return (
    <>
      <Typography sx={{ ml: 2, mb: 1 }}>
        <Link href={blog.url} underline="hover">
          {blog.url}
        </Link>
      </Typography>
      <Typography sx={{ ml: 2, mb: 1 }}>
        {blog.likes} likes{'    '}
        <Button
          type="button"
          variant="outlined"
          endIcon={<ThumbUp />}
          size="small"
          onClick={() => likeBlog(blog)}
          sx={{ borderRadius: 8 }}
        >
          like
        </Button>
      </Typography>
      <Typography sx={{ ml: 2, mb: 1 }}>Added by {blog.user.name}</Typography>
      {loggedInUser.username === blog.user.username && (
        <Button
          type="button"
          variant="outlined"
          size="small"
          onClick={() => removeBlog(blog)}
          sx={{ ml: 2, mb: 1 }}
        >
          remove
        </Button>
      )}
    </>
  );
};

export default Blog;
