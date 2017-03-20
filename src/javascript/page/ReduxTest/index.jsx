import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import Util from "extend/common/util";
import UrlUtil from "extend/common/UrlUtil";
import RequestUtil from "extend/common/RequestUtil";
import WeixinUtil from "extend/common/WeixinUtil";
import 'scss/base.scss';
import 'scss/ReduxTest/index.scss';

import AddTodo from 'containers/AddTodo';
// import VisibleTodoList from 'containers/VisibleTodoList';
// import Footer from 'components/Footer/Footer';

import {Provider} from 'react-redux';
import {createStore} from 'redux';
import todoApp from 'reducers/index.js';
import App from 'components/App/App';

let store = createStore(todoApp);

class MyComponent extends Component {
	constructor (props) {
		super(props);

	}

	render () {
		return (
			<Provider store={store}>
				<App />
			</Provider>
		)
	}
}


function doRender () {
	ReactDOM.render(<MyComponent /> , document.getElementById("app"));
}

setTimeout(doRender, 16);