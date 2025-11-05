import { AppRegistry } from 'react-native';
import { StrictMode } from 'react';
import ReactDOM from 'react-dom/client';
import { App } from './App';
import { animationKeyframes } from './utils/animations';

// Inject global animation styles
const styleElement = document.createElement('style');
styleElement.innerHTML = animationKeyframes;
document.head.appendChild(styleElement);

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error('Root element #root not found');
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <StrictMode>
    <App />
  </StrictMode>
);

AppRegistry.registerComponent('App', () => App);
