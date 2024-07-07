import { useState, React, useRef, useEffect } from "react";
import { useSocket } from "./SocketContext";
import './display-message.css';

export const MessageReceived = ({email, receiverEmail}) => {
    const socket = useSocket();
    console.log('socket id in msg'+socket.id);
    const [messagreceived, setMessageReceived] = useState([]);
    // let message;
    const messageEndRef = useRef(null);
    socket.on('message', (data) => {
        console.log(data);
        setMessageReceived(data);
    });
    useEffect(() => {
        messageEndRef.current?.scrollIntoView({behavior: 'smooth'});
    }, [messagreceived]);


    
    return (
        <>
        <a href="/list" style={{paddingLeft:'1rem'}}>Back</a>
        <p style={{paddingLeft:'1rem', margin:'0rem 0rem 1rem 0rem', fontWeight:'700'}}>{receiverEmail}</p><div className="message-display">

            {messagreceived.map((msg) => (

                <><span className={msg.email === email ? 'sender-email' : 'other-email'} key={msg._id}>{msg.email === email ? 'You' : msg.email}</span>

                    <span className={msg.email === email ? 'youMessage' : 'otherMessage'}>{msg.message}</span>
                    <br></br></>
            ))}
            <div ref={messageEndRef}/>
        </div>

        </>
    )
}