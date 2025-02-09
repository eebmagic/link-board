import React from 'react';

const Post = () => {
  return (
    <div
      className="card"
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '10px',
      }}
    >
        <input>
        </input>
        <button onClick={() => {console.log('button clicked!')}}>
            POST
        </button>
    </div>
  );
};

export default Post;
