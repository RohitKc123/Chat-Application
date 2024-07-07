import { useEffect, useRef, useState } from 'react';
import './chatpage.css';
import { useLocation } from 'react-router-dom';
import io from 'socket.io-client';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
// import sndMsg from './send-message.png';

export const ChatPage = ({youremail}) => {
    const myref = useRef(null);
    const navigate = useNavigate();
    
    const [msgValue, setmsgValue] = useState([]);
    const [inputValue, setinputValue] = useState('');

    const socket = io('http://localhost:8000');

    const location = useLocation();
    
    if (location.state){
        const {email} = location.state;
        myref.current = email;
    }else{
        navigate('/login');
    }
    const handleMessageChange = (e) => {
        setinputValue(e.target.value);
    };

    const metaData = {'sender':youremail, 'receiver': myref.current};
    // console.log(metaData);
    let response;
    useEffect(() => {
        // Make the Axios GET request
        const fetchData = async () => {
          try {
            response = await axios.get('http://localhost:8000/chat-messages', {
              params: metaData
            });
            console.log(response.data[0]?.message);
            if (!response.data[0]?.message.length == 0){
                const msg_backend = response.data[0]?.message;
                setmsgValue(msg_backend);
            }
            // console.log(response)
          } catch (error) {
            console.error(error);
          }
        };
    
        // Call the fetchData function
        fetchData();
      },[]);
    // console.log(message);

    const HandleSendMessage = () => {
        if(inputValue.trim() !== ''){
            setmsgValue([...msgValue, inputValue]);
            setinputValue('');
        }
    }
    // const updateMsgValue = msgValue;
    console.log(msgValue);
        // socket.emit('send-message', {'message': msgValue, 'sender': youremail, 'receiver': myref.current});
 
    return(
        <>
        <h1>Chat Page</h1>
        <div className="chat-box">
        <div >
            <h5>{myref.current}</h5>
            </div>
            <div className='message-box'>
            {msgValue.map((msg, index) => (
          <div key={index}>{msg}</div>
        ))}
            </div>
            
            <div>
            <label>Message:</label>
            <input className='message-input' value={inputValue} onChange={handleMessageChange}/>
            <button type='submit' className='msg-submit-btn' onClick={HandleSendMessage}>
                {/* onClick={()=>{HandleSendMessage(); sendData();}} */}
                <img  className='snd-msg-img' src='sendmssg.png' alt='send-message'/></button>
            </div>
        </div>

        </>
    )
}