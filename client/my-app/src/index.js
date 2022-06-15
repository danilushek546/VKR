import React, {createContext} from 'react';
import ReactDOM from 'react-dom';
import App from './App';

import UserStore from './strore/UserStore';
import DeviceStore from './strore/DeviceStore';
import BasketStore from './strore/BasketStore';

export const Context = createContext(null);

ReactDOM.render(
    <Context.Provider value={
        {
            user: new UserStore(),
            device: new DeviceStore(),
            basket: new BasketStore(),
        }
    }>
        <App/>
    </Context.Provider>,
    document.getElementById('root')
);