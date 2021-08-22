const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();

const PORT = 4002;

const posts = {};

app.use(cors());
app.use(express.json());

app.get('/posts', (req, res) => {
  res.send(posts);
});

const handleEvents = (type, data) => {
  if (type === 'PostCreated') {
    const { id, title } = data;
    posts[id] = { id, title, comments: [] };
  }

  if (type === 'CommentCreated') {
    const { id, content, postId, status } = data;
    const post = posts[postId];
    post.comments.push({ id, content, status });
  }

  if (type === 'CommentUpdated') {
    const { postId } = data;
    const comment = posts[postId].comments.find(
      (comment) => comment.id === data.id
    );

    comment.status = data.status;
  }
};

// event bus subscribe
app.post('/events', (req, res) => {
  console.log('Recieved Event', req.body.type);

  const { type, data } = req.body;

  handleEvents(type, data);

  res.send({ status: 'OK' });
});

app.listen(PORT, async () => {
  console.log(`Query service is running on PORT: ${PORT}`);

  // event sync implementation
  const res = await axios.get('http://event-bus-srv:4005/events');

  const events = res.data;

  for (let event of events) {
    console.log(event.type, event.data);
    handleEvents(event.type, event.data);
  }
});
