import { useState } from "react";
import { useSocket } from "./SocketContext";
import './send-message.css';

export const SendMessage = ({email, receiverEmail}) => {
    const socket = useSocket();
    const [message, setMessage] = useState('');
    // console.log(socket)
    const SendMsg = () => {
    if (socket){
        if (message !== ''){
            const _createdtime = Date.now();
            socket.emit('send_message', {email, message, _createdtime, receiverEmail});
            // console.log(message);
            setMessage('');
        }
    }
}
return(
    <div className="send_message" style={{padding:'1rem'}}>
    <input 
    placeholder="Message..."
    onChange={(e) => setMessage(e.target.value)}
    value={message}
    />
    <button className="btn btn-primary" onClick={SendMsg}>Send Message</button>
    </div>
)
}