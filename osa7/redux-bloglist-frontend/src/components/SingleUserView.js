import { useSelector } from 'react-redux';

const SingleUserView = ({ user }) => {
  const loggedInUser = useSelector((state) => state.loggedInUser);

  if (loggedInUser && user) {
    return (
      <div>
        <h2>{user.name}</h2>
        <ul>
          {user.blogs.map((blog) => (
            <li key={blog.id}>{blog.title}</li>
          ))}
        </ul>
      </div>
    );
  }
};

export default SingleUserView;
