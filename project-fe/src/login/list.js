import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Button } from '@mui/material';
import './list.css';
import { Link } from 'react-router-dom';

export const UserList = ({ token , email}) => {
  const [users, setUsers] = useState([]);
  // console.log("users" + users);
  const navigate = useNavigate();
  const handleLogout =() => {
    localStorage.removeItem('token');
    window.location.href='/login';
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log(email)
        const response = await axios.get('http://localhost:8000/users', {
          headers: {
            'Authorization': `${token}`
          },
          params: {'email' : email}

        });

        const users_list = response.data.users;
        // console.log(users_list)
        setUsers(users_list);
        // console.log(users);
      } catch (error) {
        navigate('/login');
        console.error(error);
      }
    };

    fetchData();

  }, [navigate, token, email]);

  return (
    <div className='main-div-user'> 
      <h1 className='userlist-title'>User's to Chat</h1>
    <div className='user-list'>
      {users ? (users.map((user) => (
        // <><a href='/chat' style={{ textDecoration: 'none' }}>here to chat</a>
        // <a href='/chat' key={user._id}>{user.email}</a>
        <Link to='/chat' state={{email:user.email}} key={user._id}>{user.email}</Link>
      ))):<p>...loading</p>}

      </div>
      
      <Button className='logout-button' variant='outlined' onClick={handleLogout}>Logout</Button>
    </div>

  );
};
