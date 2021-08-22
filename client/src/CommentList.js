import React from 'react';

const CommentList = ({ comments }) => {
  const renderedComments = comments.map(({ id, content, status }) => {
    return (
      <li key={id}>
        {content}:{status}
      </li>
    );
  });

  return <ol>{renderedComments}</ol>;
};

export default CommentList;
