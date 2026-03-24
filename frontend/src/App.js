import React, { useState, useEffect, useRef } from 'react';
import './App.css';
import 'primereact/resources/themes/lara-light-indigo/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import { Toast } from 'primereact/toast';

import Post from './components/Post.js';
import Link from './components/Link.js';
import { getLinks } from './helpers/api.js';

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

  const handleDelete = (idx) => {
    setLinks(links.filter(link => link.idx !== idx));
  };

  const handleEdit = (idx, title) => {
    console.log('handleEdit:', idx, title);
    try {
      setLinks(links.map(link => link.idx === idx ? { ...link, title: title } : link));
    } catch (error) {
      console.error('Error editing link:', error);
    }
  };

  const handleChange = () => {
    // Make request to get the links again now that a change was made
    fetchLinks();
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
        <Post style={{ width: '100%', maxWidth: '800px' }} onLinkAdded={fetchLinks} showToast={showToast} />
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          width: '100%',
          marginTop: '2rem'
        }}>
          {links.map(link => (
            <Link key={link.idx} link={link} onDelete={handleDelete} onEdit={handleEdit} onChange={handleChange}/>
          ))}
        </div>
      </header>
    </div>
  );
}

export default App;
