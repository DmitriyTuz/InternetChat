import React, { useState, useEffect } from "react";
import queryString from 'query-string';
import io from "socket.io-client";

import TextContainer from '../TextContainer/TextContainer';
import Messages from '../Messages/Messages';
import InfoBar from '../InfoBar/InfoBar';
import Input from '../Input/Input';

import './Chat.css';

const ENDPOINT = 'http://localhost:5000/';

let socket;

const Chat = ({ location }) => {
  const [id, setId] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [room, setRoom] = useState('');
  const [users, setUsers] = useState('');
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);

  console.log('111name = ', name);

  useEffect(() => {

    const { email, name, room } = queryString.parse(location.search);

    socket = io(ENDPOINT);

    console.log('222name = ', name);
    setEmail(email);
    setRoom(room);
    setName(name);

    console.log('333name = ', name);

    socket.emit('join', { email, name, room }, (error) => {

      console.log('name = ', name);
      if(error) {
        alert(error);
      }
    });
  }, [ENDPOINT, location.search]);
  
  useEffect(() => {

    socket.on('message', message => {
      console.log('***id = ', message.userId);
      setId(message.userId);
      setRoom(message.roomName);
      console.log('***1 massage= ', message);
      setMessages(messages => [ ...messages, message ]);
    });
    
    socket.on("roomData", ({ users }) => {
      setUsers(users);
    });
}, []);

  const sendMessage = (event) => {
    event.preventDefault();

    if(message) {
      console.log('***id = ', id);
      console.log('***room = ', room);
      console.log('***2 message = ', message);
      socket.emit('sendMessage', {id, room, message}, () => setMessage(''));
    }
  }

  return (
    <div className="outerContainer">
      <div className="container">
          <InfoBar room={room} />
          <Messages messages={messages} name={name} />
          <Input message={message} setMessage={setMessage} sendMessage={sendMessage} />
      </div>
      <TextContainer users={users}/>
    </div>
  );
}

export default Chat;
