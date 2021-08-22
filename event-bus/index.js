const express = require('express');
const axios = require('axios');

const app = express();

const PORT = 4005;

app.use(express.json());

const events = [];

app.post('/events', (req, res) => {
  const event = req.body;

  events.push(event);

  console.log('Recieved Event', req.body.type, req.body.data);

  // post-clusterip-srv is a kubernetes cluster ip Service Object  which let us send messages to posts service
  axios.post('http://posts-clusterip-srv:4000/events', event).catch((err) => {
    console.log(err.message);
  });

  // comments
  axios.post('http://comments-srv:4001/events', event).catch((err) => {
    console.log(err.message);
  });

  // query
  axios.post('http://query-srv:4002/events', event).catch((err) => {
    console.log(err.message);
  });

  // moderation
  axios.post('http://moderation-srv:4003/events', event).catch((err) => {
    console.log(err.message);
  });

  res.send({ status: 'OK' });
});

app.get('/events', (req, res) => {
  res.send(events);
});

app.listen(PORT, () =>
  console.log(`Event Bus service is running on PORT: ${PORT}`)
);
