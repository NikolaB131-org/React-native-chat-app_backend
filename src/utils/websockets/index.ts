import WebSocket, { WebSocketServer } from 'ws';
import http from 'http';
import User from '../../modules/user/user.model';
import Chat from '../../modules/chats/chats.model';
import Message, { MessageType } from '../../modules/message/message.model';
import chatsService from '../../modules/chats/chats.service';
import {
  UserDocument,
  WSClientAllChatsEvent,
  WSServerAuthEvent,
  WSClientReceiveMessageEvent,
  WSServerSendMessageEvent,
  WSServerAllEvents,
} from './types';

let wss: WebSocket.Server;
const clientsMap = new Map<WebSocket, string>();
const reverseClientsMap = new Map<string, WebSocket>();

const start = (server: http.Server) => {
  wss = new WebSocketServer({ server });
  wss.on('connection', (ws, request) => connection(ws, request));
};

const connection = async (ws: WebSocket, request: http.IncomingMessage) => {
  let userId = '';
  let userDocument: UserDocument | null;

  ws.onmessage = async message => {
    const data: WSServerAllEvents = JSON.parse(message.data.toString());

    try {
      switch (data.event) {
        case 'auth': {
          [userId, userDocument] = await authEvent(ws, data);
          break;
        }
        case 'send_message': {
          if (userDocument) {
            await sendEvent(data, userDocument);
          }
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
    console.log(`websockets: User ${userId} disconnected`);
  };
};

const authEvent = async (ws: WebSocket, data: WSServerAuthEvent): Promise<[string, UserDocument | null]> => {
  const userId = data.token;

  const user = await User.findById(userId);
  const isUserConnected = reverseClientsMap.has(userId);
  if (!user || isUserConnected) {
    ws.close();
    return ['', null];
  }

  const sendData: WSClientAllChatsEvent = { event: 'all_chats', chats: await chatsService.getAllChats(userId) };
  ws.send(JSON.stringify(sendData));
  clientsMap.set(ws, userId);
  reverseClientsMap.set(userId, ws);
  console.log(`websockets: User ${userId} connected`);
  return [userId, user];
};

const sendEvent = async (data: WSServerSendMessageEvent, user: UserDocument) => {
  const { chatId, message } = data;

  const chat = await Chat.findById(chatId).catch(err => {
    throw new Error('Chat id has an incorrect format');
  });
  if (!chat) throw new Error('Chat with this id was not found');

  const messageDocument = await Message.create({ message, sender: user });
  chat.messages.push(messageDocument);
  await chat.save();

  wss.clients.forEach(async client => {
    const clientId = clientsMap.get(client);
    const isUserJoinedChat = Boolean(await User.findById(clientId).findOne({ joinedChats: chatId }));

    const messageObject: Omit<MessageType, 'joinedChats'> = (
      await messageDocument.populate({ path: 'sender', select: '-joinedChats' })
    ).toObject();

    if (isUserJoinedChat && client.readyState === WebSocket.OPEN) {
      const sendData: WSClientReceiveMessageEvent = {
        ...messageObject, // returns fields id, message, sender, createdAt
        event: 'receive_message',
        chatId,
      };
      client.send(JSON.stringify(sendData));
    }
  });
};

export default {
  start,
};
