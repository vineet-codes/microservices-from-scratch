const express = require('express');
const { randomBytes } = require('crypto');
const cors = require('cors');
const axios = require('axios');

const app = express();

const PORT = 4001;

const CommentsByPostId = {};

app.use(cors());

app.use(express.json());

// /posts/:id/comments
// Method: POST
// params: id => post_id
//  create a comment associated with give post id
app.post('/posts/:id/comments', async (req, res) => {
  const { id } = req.params;
  const commentID = randomBytes(4).toString('hex');
  const { content } = req.body;

  const comments = CommentsByPostId[id] || [];
  comments.push({ id: commentID, content, status: 'pending' });
  CommentsByPostId[id] = comments;

  // send a CommentCreated event to the event bus
  await axios.post('http://event-bus-srv:4005/events', {
    type: 'CommentCreated',
    data: {
      id: commentID,
      content,
      postId: id,
      status: 'pending',
    },
  });

  res.status(201).send(CommentsByPostId[id]);
});

// /posts/:id/comments
// GET
// Retrieve all comments associated with the given posts id
app.get('/posts/:id/comments', (req, res) => {
  const { id } = req.params;
  const result = CommentsByPostId[id] || [];
  res.send(result);
});

app.post('/events', async (req, res) => {
  console.log('Recieved Event', req.body.type);
  const { type, data } = req.body;

  if (type === 'CommentModerated') {
    //  find the comment for the given postid
    const comments = CommentsByPostId[data.postId];
    //  update the status field of the comment with commentId
    const comment = comments.find((comment) => {
      return comment.id === data.id;
    });
    comment.status = data.status;

    await axios.post('http://event-bus-srv:4005/events', {
      type: 'CommentUpdated',
      data: {
        id: comment.id,
        content: data.content,
        status: data.status,
        postId: data.postId,
      },
    });
  }

  res.send({ status: 'OK' });
});

app.listen(PORT, () =>
  console.log(`Comments Service is running on PORT: ${PORT}`)
);
