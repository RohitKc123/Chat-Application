import { useLocation } from "react-router-dom";
// import { ChatPage } from "./chatpage"
import { MessageReceived } from "./display-message";
import { SendMessage } from "./send-message";
import { useSocket } from "./SocketContext";
import './index.css';

const Chat = ({youremail}) => {
    // const socket = io('http://localhost:8000');
    const socket = useSocket();
    const location = useLocation();
    // console.log(location.state);
    
    let receiverEmail;
    if (location.state){
    receiverEmail = location.state;
    console.log(receiverEmail['email'], youremail);
    }
    const user_arr = [youremail, receiverEmail['email']];
    const sorted_user = user_arr.sort();
    const user1 = sorted_user[0];
    const user2 = sorted_user[1];
    socket.emit('room_name', `${user1}${user2}`);
    return(
        <div className="chat-main">
            
            <div className="chat-box">
                <MessageReceived 
                email={youremail}
                // socket={socket}
                receiverEmail = {receiverEmail['email']}
                />
                <SendMessage email={youremail}
                // socket={socket}
                receiverEmail = {receiverEmail['email']}
                />
            </div>
        </div>
    )
}

export default Chat;