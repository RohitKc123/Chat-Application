const express = require("express");
const cors = require("cors");
const app = express();
app.use(cors());
app.use(express.json());


const { secret } = require("../auth.config");

const jwt = require('jsonwebtoken');
const mongodb = require("mongodb").MongoClient;
const bcrypt = require("bcryptjs");
const secret_key = secret;
const verifyToken = require('../middlewares/auth.jwt')
const http = require('http').createServer(app);
const socketio = require('socket.io');
const { send } = require("process");
const { error } = require("console");
// const io = socketio(http)
// (http, {cors: {origin: "http://localhost:3000"}});
const io = socketio(http, {
    cors: {
      origin: 'http://localhost:3000', // Adjust this to your React app's origin
      methods: ['GET', 'POST'],
    },
  });


io.on('connection', (socket)=>{
    // console.log(socket);
    console.log("A user connected", socket.id);

    const collectionName = 'Chat_Message';
    let message;
   
    
    socket.on('room_name', (data)=> {
        getMessage(collectionName, data).then(response => {
            console.log(response);
            socket.join(data);
            socket.emit('message', response);
        }).catch(error=>{
            console.log(error);
        })
    })
    socket.on('send_message', (data)=>{
        message = data
        // console.log('Message from client', data);
        connectToDatabase(url).then(async(client) => {
            const user_arr = [data['email'], data['receiverEmail']];
            console.log(data['email'], data['receiverEmail']);
            const sorted_user = user_arr.sort();
            console.log(sorted_user);
            const user1 = sorted_user[0];
            const user2 = sorted_user[1];
            console.log(`${user1},${user2}`)
            data.room = `${user1}${user2}`;
            console.log(data);
            // console.log(data);
            const db = client.db();
            const roomname = data.room;
            // socket.join(roomname);
            console.log(socket.rooms);
            // db.createCollection(collectionName);
            await db.collection(collectionName).insertOne(data);
            getMessage(collectionName, data.room).then(response => {
                console.log(data.room);
                io.to(data.room).emit('message', response);
                
            }).catch(error=>{
                console.log(error);
            })
        })
    });
    
    socket.on('disconnect', ()=>{
        console.log('User disconnected')
    });
})

// app.get(`/chat-messages`, (req,res) => {
//     connectToDatabase(url).then( async (client) => {
//         const db = client.db();
//         const collectionName = 'Messages';
//         const {sender, receiver} = req.query;
//         console.log(sender, receiver);
//         const Message = db.collection(collectionName).find({'sender': sender, 'receiver': receiver}).sort({_id: -1}).limit(1);
//         console.log("inside function"+Message);
//         Message.toArray().then(result => {
//             res.send(result);
//             console.log(result);
//         }).catch(error => {
//             console.log(error)
//         })
        
//     }).catch(error => {
//         console.log(error);
//     })
// })


const url = 'mongodb://localhost:27017/';

const connectToDatabase = async (url) => {
    try{
        return await mongodb.connect(url);
    }catch(err){
        console.log("Error connecting", err.message);
    }
}



app.get('/users', verifyToken, (req, res) => {
    connectToDatabase(url).then( async (client)=> {
        try{
            // console.log(req.header('Authorization'));
        const user_email = req.query.email;
        const con = client.db();
        const collectionName = "Users";
        const users = await con.collection(collectionName).find({'email':{$ne:user_email}}).limit(100).toArray()
        res.send({"users":users});
    }
        catch(error){
            res.send(500).send("Server Error")
        }
    }

    ).catch(err => {

    });
});



app.post('/login', (req, res) => {
    connectToDatabase(url).then(async(client)=>{
        try{
            const con = client.db();
            const collname = "Users";
            const {email, password} = req.body;
            const user_obj = await con.collection(collname).findOne({'email':email}, {projection:{encoded_password: 1}})
            // console.log(user_obj.encoded_password);
            if (!user_obj){
                res.status(500).json("User with this email does not exist.")
                res.end();
            }else{
                bcrypt.compare(password, user_obj.encoded_password, function(err, results){
                    if(err){
                        throw new Error(err)
                     }
                     if (results) {
                        const token = jwt.sign(
                            user_obj, secret_key, {expiresIn: '1h'});
                        // console.log(token);
                        return res.status(200).json({token, msg: "Login success" })
                    } else {
                        return res.status(401).json({ msg: "Invalid credencial" })
                    }
                   });
            // const user_password = await con.collection(collname).findOne({'email': email},)
            
            }

        }catch(error){
            console.log(error.message);
        }
    }).catch(error => {
        console.log(error.message);
    })
});



app.post('/register', (req, res) => {
    connectToDatabase(url).then(async (client) => {
        try{
        console.log(req.body);
        const con = client.db();
        const collname = "Users";
        const {email, username, password} = req.body;
        // const user_email = await con.collection(collname).createIndex({"email":1}, {unique:true});
        const user_obj = await con.collection(collname).findOne({"email":email})
        if (!user_obj){
            const encoded_password = bcrypt.hashSync(req.body.password);
        const user = await con.collection(collname).insertOne({email, username, encoded_password});
        console.log(user);
        res.send("User registered successfuly.");
        }else{
            console.log("inside else");
            res.status(500).send("User with this email already exists.");
        }

    }catch{

    }}).catch(error => {
        console.log(error);
    })
    
});



const port = 8000;
http.listen(port, () => {
    console.log(`Server is running on port ${port}`);
})



const getMessage = async(collectionName, roomname) => {
    try{
        const client = await mongodb.connect(url);
        const db = client.db();
        const responseMessage = await db.collection(collectionName).
            find({'room':roomname}).sort({_createdtime: 1}).limit(100).toArray();
            // console.log(responseMessage);
            return responseMessage;
    }catch(error){
        throw error;

    }
}