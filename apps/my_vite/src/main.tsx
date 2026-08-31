import { StrictMode } from 'react';
import * as ReactDOM from 'react-dom/client';
import App from './app/app';
import './index.css';


const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error('Failed to find the root element. Ensure index.html has <div id="root"></div>');
}

ReactDOM.createRoot(rootElement).render(
  <StrictMode>
      <App />
  </StrictMode>,
);
