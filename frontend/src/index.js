import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { TooltipProvider } from './components/ui/tooltip.jsx';
// import store from './store.js';
// import { Provider } from 'react-redux';
import { AuthProvider } from './context/AuthContext.jsx';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <AuthProvider>
    <TooltipProvider>
      <App />
    </TooltipProvider>
  </AuthProvider>
);

