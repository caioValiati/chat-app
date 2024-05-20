import { useState, useEffect, useRef } from 'react';
import { HttpTransportType, HubConnection, HubConnectionBuilder } from '@microsoft/signalr';
import axios from 'axios';
import { API_ENDPOINTS } from '../../constants/apiUrls';
import { Button, Icon, TextField } from '@mui/material';
import { Sidebar } from '../../components/sidebar/Sidebar';

interface MessageObj {
  id: number,
  usuarioRemetente: number,
  usuarioDestinatario: number,
  dataEnvio: Date,
  conteudo: string,
}

function App() {
  const [users, setUsers] = useState<{id:number, userName: string}[]>([])
  const [connectionId, setConnectionId] = useState('')
  const [connection, setConnection] = useState<HubConnection | null>(null);
  const [messages, setMessages] = useState<MessageObj[]>([]);
  const [messageInput, setMessageInput] = useState('');
  const [userForId, setUserForId] = useState<number>();
  const firstRender = useRef(false);
  const userId = JSON.parse(localStorage.getItem('User') ?? '').id;
  // const userName = localStorage.getItem('userName');

  useEffect(() => { 
    const createConnection = async () => {
      axios.get(API_ENDPOINTS.GET_MENSAGENS, {
        headers: { "Authorization": `Bearer ${localStorage.getItem("Bearer")}` },
      })
      .then((responseData) => {
        setMessages(responseData.data)
      });

      axios.get(API_ENDPOINTS.GET_USUARIOS, {
        headers: { "Authorization": `Bearer ${localStorage.getItem("Bearer")}` }
      })
        .then((response: any) => setUsers(response.data))

      const newConnection = new HubConnectionBuilder()
        .withUrl(API_ENDPOINTS.MESSAGES_HUB, {
          skipNegotiation: true,
          transport: HttpTransportType.WebSockets,
        })
        .build();

      newConnection.on('ReceiveMessage', (messageObj) => {
        setMessages((prevMessages) => [...prevMessages, messageObj]);
      });

      newConnection.on('ConnectionId', (id) => {
        setConnectionId(id)
      });

      try {
        await newConnection.start();
        newConnection.invoke('PublishUserOnConnectedAsync', userId)
        setConnection(newConnection);
      } catch (error) {
        console.error('Error establishing connection:', error);
      }
    };

    if (!firstRender.current) {
      firstRender.current = true;
      createConnection();
    }

    return () => {
      if (connection) {
        connection.stop();
      }
    };
  }, []);

  const sendMessage = (message: string) => {
    const messageObj = {
      id: 0,
      usuarioRemetente: userId,
      usuarioDestinatario: userForId,
      dataEnvio: new Date(),
      conteudo: message,
    }
    if (connection) {
      connection.invoke('SendMessage', messageObj)
        .catch((err) => console.error('Error sending message:', err));
    } else {
      console.error('WebSocket connection not established');
    }
  };

  return (
    <div>
      <Sidebar setUserForId={setUserForId} userForId={userForId ?? 0} />
      {userForId && <><ul>
        {messages.map((message, index) => (
          <li key={index}>
            <strong>
            {users.filter(
              (user: any) => 
              user.id === message.usuarioRemetente)[0].userName
            + " "}:</strong> {message.conteudo}
          </li>
        ))}
      </ul>

      <form onSubmit={(event) => {
        event.preventDefault();
        sendMessage(messageInput);
      }}>
        <TextField type="text" id="messageInput" onChange={(e) => setMessageInput(e.target.value)} placeholder="Your message" />
        <Button variant='contained' type="submit">SEND</Button>
      </form></>}
    </div>
  );
};

export default App;