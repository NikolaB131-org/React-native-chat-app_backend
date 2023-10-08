import WebSocket, { WebSocketServer } from 'ws';
import http from 'http';
import { WSSendEvent } from './types';
import User from '../../modules/user/user.model';
import Chat from '../../modules/chat/chat.model';
import Message from '../../modules/message/message.model';

let wss: WebSocket.Server;
const clientsMap = new Map<WebSocket, string>();
const reverseClientsMap = new Map<string, WebSocket>();

const start = (server: http.Server) => {
  wss = new WebSocketServer({ server });
  wss.on('connection', (ws, request) => connection(ws, request));
}

const connection = async (ws: WebSocket, request: http.IncomingMessage) => {
  const userId: string = request.headers.authorization?.split(' ')[1] ?? '';
  const isUserExists = await User.exists({ _id: userId }).catch(() => false);
  const isUserConnected = reverseClientsMap.has(userId);
  if (!isUserExists || isUserConnected) { // TODO возможно сделеать двойную мапу
    ws.close();
    return;
  }

  console.log(`User ${userId} connected`);
  clientsMap.set(ws, userId);
  reverseClientsMap.set(userId, ws);

  ws.onmessage = event => {
    const data = JSON.parse(event.data.toString());

    switch (data.event) {
      case 'send': {
        sendEvent(data, userId);
        break;
      }
    }
  };

  ws.onclose = () => {
    clientsMap.delete(ws);
    reverseClientsMap.delete(userId);
    console.log(`User ${userId} disconnected`)
  };
};

const sendEvent = async (data: WSSendEvent, userId: string) => {
  const { chatId, message } = data;

  const senderUser = await User.findById(userId);
  const chat = await Chat.findById(chatId);
  if (!senderUser || !chat) return;

  wss.clients.forEach(async client => {
    const clientId = clientsMap.get(client);
    const isUserJoinedChat = Boolean(await User.findById(clientId).findOne({ joinedChats: chatId }));

    if (isUserJoinedChat && client.readyState === WebSocket.OPEN) {
      const messageObject = await Message.create({ message, senderId: senderUser });
      chat.messages.push(messageObject);
      await chat.save();
      client.send(JSON.stringify({ event: 'receive', userId, chatId, message }));
    }
  });
};

export default {
  start,
};
