import React, { useState } from 'react';
import { InputTextarea } from 'primereact/inputtextarea';
import { Button } from 'primereact/button';
import ReactMarkdown from 'react-markdown';
import { addLink } from '../helpers/api';

const Post = ({ onLinkAdded, showToast }) => {
  const [text, setText] = useState('');

  const handleSubmit = async () => {
    try {
      await addLink(text);
      setText('');
      showToast('success', 'Success', 'Link added successfully');

      if (onLinkAdded) {
        onLinkAdded();
      }
    } catch (error) {
      console.error('Error posting link:', error);
      showToast('error', 'Error', 'Failed to add link');
    }
  };

  // Check if input contains multiple lines
  const isMultiline = text.includes('\n');

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      gap: '1rem',
      marginTop: '1rem',
      width: '80%',
      maxWidth: '600px'
    }}>
      <InputTextarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Enter a URL or text (supports Markdown)"
        rows={5}
        style={{ width: '100%' }}
      />

      {isMultiline && (
        <div style={{
          backgroundColor: '#f5f5f5',
          padding: '1rem',
          borderRadius: '4px',
          textAlign: 'left',
          color: '#333'
        }}>
          <ReactMarkdown>{text}</ReactMarkdown>
        </div>
      )}

      <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
        <Button label="Add" onClick={handleSubmit} />
      </div>
    </div>
  );
};

export default Post;
