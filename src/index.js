import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// Import PatternFly CSS
import '@patternfly/react-core/dist/styles/base.css';
import '@patternfly/patternfly/patternfly.css';
import './pageLayout.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
); 