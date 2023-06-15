import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { setLoggedInUser } from '../reducers/loggedInReducer';

const Menu = () => {
  const loggedInUser = useSelector((state) => state.loggedInUser);
  const dispatch = useDispatch();

  const menu = {
    paddingLeft: 8,
    paddingRight: 8,
    paddingTop: 5,
    paddingBottom: 5,
    margin: 0,
    background: '#E0EEEE',
  };

  const padding = {
    padding: 5,
  };

  const handleLogout = async () => {
    console.log(`logging out user '${loggedInUser.name}' ...`);
    window.localStorage.removeItem('loggedBloglistUser');
    dispatch(setLoggedInUser(null));
    window.location.reload();
  };

  return (
    <div style={menu}>
      <Link style={padding} to="/">
        blogs
      </Link>
      <Link style={padding} to="/users">
        users
      </Link>
      {loggedInUser && (
        <span>
          logged in as {loggedInUser.name}{' '}
          <button type="button" onClick={handleLogout}>
            logout
          </button>
        </span>
      )}
    </div>
  );
};

export default Menu;
