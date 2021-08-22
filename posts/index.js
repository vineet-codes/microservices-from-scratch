const express = require('express');
const cors = require('cors');
const { randomBytes } = require('crypto');
const axios = require('axios');

const app = express();

const PORT = 4000;

const POSTS = {};

app.use(cors());
app.use(express.json());

app.get('/posts/', (req, res) => {
  res.send(POSTS);
});

app.post('/posts/create', async (req, res) => {
  const id = randomBytes(4).toString('hex');
  const { title } = req.body;

  POSTS[id] = { id, title };

  // sending messages to event bus - event-bus-srv is a kubernetes cluster ip Service for the event bus
  await axios.post('http://event-bus-srv:4005/events', {
    type: 'PostCreated',
    data: { id, title },
  });

  res.status(201).send(POSTS[id]);
});

app.post('/events', (req, res) => {
  console.log('Recieved Event', req.body.type);
  res.send({ status: 'OK' });
});

app.listen(PORT, () => {
  console.log('v55');
  console.log(`Posts service is running on PORT: ${PORT}`);
});
