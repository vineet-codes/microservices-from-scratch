const express = require('express');
const axios = require('axios');

const app = express();

const PORT = 4003;

app.use(express.json());

app.post('/events', async (req, res) => {
  console.log('Recieved Event', req.body.type);

  const { type, data } = req.body;

  if (type === 'CommentCreated') {
    //   event processing logic goes here
    // business logic of this service
    const status = data.content.includes('orange') ? 'rejected' : 'approved';

    await axios.post('http://event-bus-srv:4005/events', {
      type: 'CommentModerated',
      data: {
        id: data.id,
        postId: data.postId,
        status: status,
        content: data.content,
      },
    });
  }
  res.send({ status: 'OK' });
});

app.listen(PORT, () =>
  console.log(`Query service is running on PORT: ${PORT}`)
);
