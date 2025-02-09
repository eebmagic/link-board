import React, { useState } from 'react';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';

const Post = ({ onLinkAdded }) => {
  const [link, setLink] = useState('');

  const handleSubmit = async () => {
    try {
      const response = await fetch('http://links.ebolton.site/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ link }),
      });

      if (!response.ok) {
        throw new Error('Failed to post link');
      }

      // Clear input after successful post
      setLink('');
      
      // Trigger refresh of links
      if (onLinkAdded) {
        onLinkAdded();
      }
    } catch (error) {
      console.error('Error posting link:', error);
    }
  };

  return (
    <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
      <InputText
        value={link}
        onChange={(e) => setLink(e.target.value)}
        placeholder="Enter a URL"
      />
      <Button label="Add Link" onClick={handleSubmit} />
    </div>
  );
};

export default Post;
