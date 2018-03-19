import React from 'react';
import ReactDOM from 'react-dom';
import configureStore from './store/configureStore'
import { Provider } from 'react-redux'
import { BrowserRouter, Route } from 'react-router-dom'
import 'semantic-ui-css/semantic.min.css';
import './css/index.css';
import App from './components/App';
import registerServiceWorker from './registerServiceWorker';
const store = configureStore();
ReactDOM.render(<Provider store={store}>
    <BrowserRouter>
        <div>
            <Route path='/' component={App} />
        </div>
    </BrowserRouter>
</Provider>, document.getElementById('root'));
registerServiceWorker();
