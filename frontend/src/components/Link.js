import React from 'react';
import { LinkPreview } from '@dhaiwat10/react-link-preview';
import { Button } from 'primereact/button';
import ReactMarkdown from 'react-markdown';

const Link = ({ link }) => {
  const copyToClipboard = () => {
    navigator.clipboard.writeText(link.link);
  };

  // URL validation regex
  const urlRegex = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;

  const isUrl = urlRegex.test(link.link);

  if (isUrl) {
    console.log(`Creating link card for link:`, link);
  }

  return (
    <div className="link-card" style={{
      margin: '1rem',
      padding: '1rem',
      border: '1px solid #ddd',
      borderRadius: '8px',
      maxWidth: '500px'
    }}>
      {isUrl ? (
        // Handle as link
        <a href={link.link} target="_blank" rel="noopener noreferrer" style={{textDecoration: 'none'}}>
          <LinkPreview url={link.link} width="100%" />
        </a>
      ) : (
        // Handle as markdown
        <div className="markdown-content">
          <ReactMarkdown>{link.link}</ReactMarkdown>
        </div>
      )}
      <div style={{marginTop: '1rem', display: 'flex', justifyContent: 'flex-end'}}>
        <Button 
          icon="pi pi-copy" 
          onClick={copyToClipboard}
          tooltip="Copy content"
          tooltipOptions={{ position: 'top' }}
        />
      </div>
    </div>
  );
};

export default Link;
