import { useState } from 'react';
import './register.css';
import axios from 'axios';

export const RegisterForm = () => {
    const [data, setformdata] = useState();
    const [error, setError] = useState();
    async function FormSubmit(e){
    e.preventDefault();
    try{
    await axios.post('http://localhost:8000/register', data);  
    }catch(error){
        setError(error);
    }
}
const HandleInput = (e) => {
    // const {target} = e;
    // console.log(target);
    // const {name, value} = target;
    console.log(e.target.name, e.target.value);
    setformdata({...data, [e.target.name]:e.target.value});
    // console.log(data);
}
    


    return(
        <div className="register-form-div">
        <form className="register-form" onSubmit={FormSubmit}>
            {error ? <p>An error occured: {error.message}</p>: null}
            <label>Email</label>
            <input name='email' onChange={HandleInput}/>
            <br></br>
            <label>Username</label>
            <input name='username' onChange={HandleInput}/>
            <br></br>
            <label>Password</label>
            <input name='password' type='password' onChange={HandleInput}/>
            <button type='submit' className='form-submit' >Sign up</button>
            <a href='/login'>Login in</a>
        </form>
        </div>
    )
}
