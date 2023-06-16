import React from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

const UserListView = () => {
  const loggedInUser = useSelector((state) => state.loggedInUser);
  const userList = useSelector((state) => state.userList);

  if (loggedInUser) {
    return (
      <div>
        <h2>Users</h2>
        <table>
          <thead>
            <tr>
              <th></th>
              <th>blogs created</th>
            </tr>
          </thead>
          <tbody>
            {userList.map((user) => (
              <tr key={user.id}>
                <td>
                  <Link to={`/users/${user.id}`}>{user.name}</Link>
                </td>
                <td>{user.blogs.length}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }
};

export default UserListView;
