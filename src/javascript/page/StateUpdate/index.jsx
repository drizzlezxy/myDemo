import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import Util from "extend/common/util";
import UrlUtil from "extend/common/UrlUtil";
import RequestUtil from "extend/common/RequestUtil";
import WeixinUtil from "extend/common/WeixinUtil";
import 'scss/base.scss';
import 'scss/StateUpdate/index.scss';

class MyComponent extends Component {
	constructor (props) {
		super(props);
		this.state = {
			value: 0
		}
	}

	increment () {
		this.setState( pre => ({
			value: pre.value + 1
		}))
	}

	decrement () {
		this.setState( pre => ({
			value: pre.value - 1
		}))
	}

	render () {
		return (
			<div className="m-stateupdate">
	        	{this.state.value}
	        	<button onClick={this.increment.bind(this)}> + </button>
	        	<button onClick={this.decrement.bind(this)}> - </button>
			</div>
		)
	}
}


function doRender () {
	ReactDOM.render(<MyComponent /> , document.getElementById("app"));
}

setTimeout(doRender, 16);