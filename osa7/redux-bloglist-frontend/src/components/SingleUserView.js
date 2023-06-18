import { useSelector } from 'react-redux';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';

const SingleUserView = ({ user }) => {
  const loggedInUser = useSelector((state) => state.loggedInUser);

  if (loggedInUser && user) {
    return (
      <div>
        <h2>{user.name}</h2>
        <List dense>
          {user.blogs.map((blog) => (
            <ListItem key={blog.id}>{blog.title}</ListItem>
          ))}
        </List>
      </div>
    );
  }
};

export default SingleUserView;
