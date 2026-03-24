import React, { useState, useEffect, useRef } from 'react';
import './App.css';
import 'primereact/resources/themes/lara-light-indigo/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import { Toast } from 'primereact/toast';

import Post from './components/Post.js';
import Link from './components/Link.js';
import { getLinks } from './helpers/api.js';
import githubMark from './images/github-mark.svg';


function App() {
  const [links, setLinks] = useState([]);
  const toast = useRef(null);

  useEffect(() => {
    fetchLinks();
  }, []);

  const fetchLinks = async () => {
    try {
      const result = await getLinks();
      setLinks(result);
    } catch (error) {
      console.error('Error fetching links:', error);
    }
  };

  const handleChange = (toastInfo) => {
    // Make request to get the links again now that a change was made
    fetchLinks();

    // Show toast if provided
    if (toastInfo) {
      showToast(toastInfo.severity, toastInfo.summary, toastInfo.detail);
    }
  };

  const showToast = (severity, summary, detail) => {
    toast.current.show({
      severity: severity,
      summary: summary,
      detail: detail,
      life: 3000
    });
  };

  return (
    <div className="App">
      <Toast ref={toast} />
      <header className="App-header">
        <div style={{
          width: '100%',
          display: 'flex',
          justifyContent: 'flex-start',
          padding: '15px',
          boxSizing: 'border-box'
        }}>
          <a
            href="https://github.com/eebmagic/link-board"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img src={githubMark} alt="GitHub Mark" style={{ width: '30px', height: '30px', filter: 'invert(100%)' }} />
          </a>
        </div>

        <Post style={{ width: '100%', maxWidth: '800px' }} onLinkAdded={fetchLinks} showToast={showToast} />
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          width: '100%',
          marginTop: '2rem'
        }}>
          {links.map(link => (
            <Link key={link.idx} link={link} onChange={handleChange}/>
          ))}
        </div>
      </header>
    </div>
  );
}

export default App;
