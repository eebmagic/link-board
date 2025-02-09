import React, { useState } from 'react';
// import { LinkPreview } from '@dhaiwat10/react-link-preview';
import { getLinkPreview } from 'link-preview-js';
import { Button } from 'primereact/button';
import ReactMarkdown from 'react-markdown';

const Link = ({ link }) => {
  const copyToClipboard = () => {
    navigator.clipboard.writeText(link.link);
  };

  // URL validation regex
  const urlRegex = /^https?:\/\//;

  const isUrl = urlRegex.test(link.link);
  console.log(`Link is URL:`, isUrl, link.link);

  // Format the date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  const [preview, setPreview] = useState(null);
  if (isUrl) {
    console.log(`Creating link card for link:`, link);
    const prevresult = getLinkPreview(link.link);
    setPreview(prevresult);
    console.log(`Preview:`, prevresult);
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
        <>
          {/* <a href={link.link} target="_blank" rel="noopener noreferrer" style={{textDecoration: 'none'}}> */}
          {/* <LinkPreview url={link.link} width="100%" /> */}
          {preview && (
            <div>
              <h3>{preview.title}</h3>
              <p>{preview.description}</p>
              {
                preview.images && preview.images.length > 0 && (
                  <img src={preview.images[0]} alt={preview.title} />
                )
              }
            </div>
          )}
          {/* </a> */}
          <div style={{
            fontSize: '0.8rem',
            color: '#666',
            marginTop: '0.5rem',
            textAlign: 'right'
          }}>
            Added: {formatDate(link.date)}
          </div>
        </>
      ) : (
        // Handle as markdown
        <>
          <div className="markdown-content">
            <ReactMarkdown>{link.link}</ReactMarkdown>
          </div>
          <div style={{
            fontSize: '0.8rem',
            color: '#666',
            marginTop: '0.5rem',
            textAlign: 'right'
          }}>
            {formatDate(link.date)}
          </div>
        </>
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
