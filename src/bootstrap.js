import './assets/plain-css.css';

import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';

const domElement = document.querySelector('#root');
const root = createRoot(domElement);

root.render(
    <App/>,
);

// {
// property1: 4,
// prop: "str"
// handleClick: () => {return 12;}
// children: 'Custom content'
// }