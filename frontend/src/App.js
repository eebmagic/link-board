import React, { useState, useEffect } from 'react';
import './App.css';
import 'primereact/resources/themes/lara-light-indigo/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';

import Post from './components/Post.js';
import Link from './components/Link.js';
import { getLinks } from './helpers/api.js';

function App() {
  const [links, setLinks] = useState([]);

  useEffect(() => {
    const fetchLinks = async () => {
      try {
        const result = await getLinks();
        setLinks(result);
      } catch (error) {
        console.error('Error fetching links:', error);
      }
    };

    fetchLinks();
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <Post style={{ width: '100%', maxWidth: '800px' }} />
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          width: '100%',
          marginTop: '2rem'
        }}>
          {links.map(link => (
            <Link key={link.idx} link={link} />
          ))}
        </div>
      </header>
    </div>
  );
}

export default App;
