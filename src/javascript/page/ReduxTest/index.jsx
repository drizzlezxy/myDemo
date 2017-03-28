import React from 'react'
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux'
import { createStore, applyMiddleware } from 'redux'
import thunk from 'redux-thunk';
import { Router, Route, hashHistory } from 'react-router'

import allApp from 'reducers'
import TodoApp from 'components/TodoApp/App'
import ImmTodoApp from 'components/ImmTodoApp/App'
import {initialState} from 'data/initialState';

import 'scss/base.scss';
import 'scss/ReduxTest/index.scss';

console.log(hashHistory)

let store = createStore(
	allApp,
	initialState,
	applyMiddleware(thunk)
)

function doRender () {
	ReactDOM.render(
        <Provider store={store}>
		    <Router history={hashHistory}>
		      <Route path="/TodoApp" component={TodoApp} />
		      <Route path="/ImmTodoApp" component={ImmTodoApp} />
		    </Router>
        </Provider>,
        document.getElementById("app")
    );
}

setTimeout(doRender, 16);