import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './bingoField.js';
import reportWebVitals from './reportWebVitals';

//import {socket} from './websocket/socket.js';



const root = ReactDOM.createRoot(document.getElementById('root'));
// Has to be called App
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
