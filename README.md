# React native chat app backend

## [Link to mobile app repo](https://github.com/NikolaB131-org/React-native-chat-app_mobile)

## Made with

- Typescript
- Express
- Websockets
- Mongoose

## Features

- Error handling
- Messages are sent via websockets
- Authorization is temporarily done not using tokens, but simply using the userId from the database
- CI/CD workflow

## Routes

### /chats

- Join chat: `POST /chats/join/:id` (headers: authorization), returns `ChatType`
- Leave chat: `DELETE /chats/leave/:id` (headers: authorization)
- Search chats: `GET /chats/search` (headers: authorization), returns `ChatType[]`
- Get chat info: `GET /chats/:id` (headers: authorization), returns `ChatType`
- Delete chat: `DELETE /chats/:id` (headers: authorization)
- Update chat name: `PATCH /chats/:id/?name=new chat name` (headers: authorization)
- Create chat: `POST /chats/?name=chat name`, returns `ChatType`

### /auth

- Login: `POST /login` (body: username), return userId

## Websockets

Every message should be in format: `{event: 'name of event', data fields...}`

### Server listens for events

- `{event: 'auth', token: string}` - client authentication for websocket connection. Sends back event `all_chats`.
- `{event: 'send_message', chatId: string, message: string}` - handles sended to chat message. Sends back event `receive_message`.

### Client listens for events

- `{event: 'all_chats', chats: ChatType[]}` - Sends all chats that user joined.
- `{event: 'receive_message', chatId: string}` - Sends message to all users that joined that chat.

## How to run

1. Make sure you have MongoDB version 7 installed and running

2. You can add `PORT` variable to .env.development to specify a different port instead of `3001`

3. Install dependencies
```bash
npm i
```

4. Run server in development mode
```bash
npm start
```

## Project building

1. Make sure you have file .env.production with keys specified in .env.development

2. Build the project, output will be in /dist
```bash
npm run build
```


## TODO

- Chat delete, change chat name, change image should be transmitted over websockets
- Functions in services needs to be reuse each other in clever way
