import './App.css';
import { RegisterForm } from './login/register';
import {LoginForm} from './login/login'
import { BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import { useState, useEffect } from 'react';
import { UserList } from './login/list';
import {CountInputChanges} from "./login/example";
// import {ChatPage} from './login/chatpage';
import Chat from './login';
import { SocketProvider } from './login/SocketContext';

function App() {
  
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [email, setUserEmail] = useState(localStorage.getItem('email'));
  useEffect(() => {
    localStorage.setItem('token', token);
    localStorage.setItem('email', email);
  }, [token, email]);
  // console.log(token);
  return (
    <SocketProvider>
    <Router>
      <Routes>
        <Route path='/' element={<RegisterForm
        
        />}/>
        <Route path='/login' element= {<LoginForm
        token = {token}
        setToken = {setToken}
        email = {email}
        setUserEmail = {setUserEmail}
        />}/>
       
        <Route path='/chat' element={<Chat
        youremail = {email}
        />}/>

        <Route path='/list' element={<UserList
        token = {token}
          email = {email}
        />}/>
        <Route path='/eg' 
        
        element={<CountInputChanges/>} />
    </Routes>
    </Router>
    </SocketProvider>
  );
}

export default App;
