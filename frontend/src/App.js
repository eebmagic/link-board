import logo from './logo.svg';
import './App.css';

import Post from './components/Post.js';
import { getLinks } from './helpers/api.js';

function App() {
  getLinks().then(result => {
    console.log('got result', result);
  });
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <Post/>
      </header>
    </div>
  );
}

export default App;
