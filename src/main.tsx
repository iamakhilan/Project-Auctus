import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { ErrorBoundary } from './components/common/ErrorBoundary';
import { ToastProvider } from './components/common/Toast';
import { GameStateProvider } from './context/GameStateContext';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ErrorBoundary>
      <ToastProvider>
        <GameStateProvider>
          <App />
        </GameStateProvider>
      </ToastProvider>
    </ErrorBoundary>
  </React.StrictMode>,
);
