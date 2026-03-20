const WebSocket = require('ws');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || '123123';
const token = jwt.sign({ userId: 'testuser', role: 'ADMIN' }, JWT_SECRET);

const url = `ws://localhost:8080/?token=${token}`;
console.log('Connecting to', url);

const ws = new WebSocket(url);

ws.on('open', () => {
  console.log('connected');
  ws.send('hello from test client');
});

ws.on('message', (msg) => {
  console.log('message:', msg.toString());
  ws.close();
});

ws.on('close', () => {
  console.log('closed');
  process.exit(0);
});

ws.on('error', (err) => {
  console.error('error:', err.message);
  process.exit(1);
});
