import axios from 'axios';
import './login.css';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export const LoginForm = ({token, setToken, email, setUserEmail}) => {
    const navigate = useNavigate();
    const [error, setError] = useState();
    const [data, setformData] = useState();
    const LoginFormSubmit = async (e) => {
        e.preventDefault(); //form reloads without hitting API
        try{
            // console.log(data);
            const response = await axios.post("http://localhost:8000/login", data)
            const user_token = response.data.token;
            setToken(user_token);
            setUserEmail(data['email']);
            navigate('/list');
            console.log(token);
        }catch(error){
            setError(error);
        }
    }
    const HandleFormInput = (e) => {
        
        setformData(
            {...data, [e.target.name]: e.target.value},
        )
    }
    
    return (
        <div className="login-div">
            <form className="login-form" onSubmit={LoginFormSubmit}>
                {error?<p>Invalid Email or password.</p>:null}
                <label>Email</label>
                <input name="email" onChange={HandleFormInput}/>
                <br></br>
                <label>Password</label>
                <input name="password" type="password" onChange={HandleFormInput}/>
                <br></br>
                <button type="submit">Log in</button>
                <a href='/'>Sign up</a>
            </form>
        </div>
    )
}