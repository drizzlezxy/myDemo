import Util from "extend/common/util";
import UrlUtil from "extend/common/UrlUtil";
import RequestUtil from "extend/common/RequestUtil";
import WeixinUtil from "extend/common/WeixinUtil";
import 'scss/base.scss';
import 'scss/ReduxTest/index.scss';

import React from 'react'
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux'
import { createStore } from 'redux'
import todoApp from 'reducers/index'
import App from 'components/App'

let store = createStore(todoApp)

function doRender () {
	ReactDOM.render(
        <Provider store={store}>
            <App />
        </Provider>,
        document.getElementById("app")
    );
}

setTimeout(doRender, 16);