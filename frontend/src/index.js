// Import React and ReactDOM for rendering
import React from 'react';
import ReactDOM from 'react-dom/client';
// Import the main App component
import App from './App';
// Optional: Import global styles (if you have a CSS file)
import './index.css';

// Find the root DOM element in your public/index.html file
const rootElement = document.getElementById('root');

// Create the React root and render the App component into it
const root = ReactDOM.createRoot(rootElement);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

