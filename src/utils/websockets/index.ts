import WebSocket, { WebSocketServer } from 'ws';
import http from 'http';
import User from '../../modules/user/user.model';
import Chat from '../../modules/chats/chats.model';
import Message from '../../modules/message/message.model';
import chatsService from '../../modules/chats/chats.service';
import { WSSendEvent } from './types';

let wss: WebSocket.Server;
const clientsMap = new Map<WebSocket, string>();
const reverseClientsMap = new Map<string, WebSocket>();

const start = (server: http.Server) => {
  wss = new WebSocketServer({ server });
  wss.on('connection', (ws, request) => connection(ws, request));
};

const connection = async (ws: WebSocket, request: http.IncomingMessage) => {
  const userId: string = request.headers.authorization?.split(' ')[1] ?? '';
  const isUserExists = await User.exists({ _id: userId }).catch(() => false);
  const isUserConnected = reverseClientsMap.has(userId);
  if (!isUserExists || isUserConnected) {
    ws.close();
    return;
  }

  ws.send(JSON.stringify(await chatsService.getAllChats(userId)));
  clientsMap.set(ws, userId);
  reverseClientsMap.set(userId, ws);
  console.log(`User ${userId} connected`);

  ws.onmessage = async event => {
    const data = JSON.parse(event.data.toString());

    try {
      switch (data.event) {
        case 'send': {
          await sendEvent(data, userId);
          break;
        }
      }
    } catch (error) {
      if (error instanceof Object && 'message' in error && typeof error.message === 'string') {
        ws.send(JSON.stringify({ errMessage: error.message }));
      }
    }
  };

  ws.onclose = () => {
    clientsMap.delete(ws);
    reverseClientsMap.delete(userId);
    console.log(`User ${userId} disconnected`);
  };
};

const sendEvent = async (data: WSSendEvent, userId: string) => {
  const { chatId, message } = data;

  const senderUser = await User.findById(userId);
  const chat = await Chat.findById(chatId).catch(err => {
    throw new Error('Chat id has an incorrect format');
  });
  if (!senderUser || !chat) throw new Error('Chat with this id was not found');

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
