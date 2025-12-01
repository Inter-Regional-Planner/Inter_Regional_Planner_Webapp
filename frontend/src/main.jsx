import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { PlannerProvider } from './planner/PlannerContext';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <PlannerProvider>
        <App />
      </PlannerProvider>
    </BrowserRouter>
  </React.StrictMode>
);
