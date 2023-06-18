import React from 'react';
import { useSelector } from 'react-redux';
import { Link as RouterLink } from 'react-router-dom';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Link from '@mui/material/Link';

const UserListView = () => {
  const loggedInUser = useSelector((state) => state.loggedInUser);
  const userList = useSelector((state) => state.userList);

  if (loggedInUser) {
    return (
      <>
        <h2>Users</h2>
        <TableContainer>
          <Table>
            <TableHead
              sx={{
                '& .MuiTableCell-head': {
                  fontWeight: '700',
                },
              }}
            >
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell align="right">Blogs</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {userList.map((user) => (
                <TableRow
                  key={user.id}
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  <TableCell component="th" scope="row">
                    <Link
                      component={RouterLink}
                      to={`/users/${user.id}`}
                      underline="none"
                    >
                      {user.name}
                    </Link>
                  </TableCell>
                  <TableCell align="right">{user.blogs.length}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </>
    );
  }
};

export default UserListView;
