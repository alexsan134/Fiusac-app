import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './Components/App/App';
import * as serviceWorker from './serviceWorker';
import M from 'materialize-css/dist/js/materialize.min.js';

window.addEventListener('offline', () => M.toast({ html: 'Sin conexión a Internet' }));
window.addEventListener('online', () => M.toast({ html: 'De nuevo en linea' }));

ReactDOM.render(<App />, document.getElementById('root'));
serviceWorker.register();