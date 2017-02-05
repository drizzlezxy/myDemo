import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import Util from "extend/common/util";
import RequestUtil from "extend/common/RequestUtil";
import WeixinUtil from "extend/common/WeixinUtil";
import Logger from "extend/common/Logger";
import 'scss/base.scss';
import 'scss/YQPayFail/index.scss';

class MyComponent extends Component {
	constructor (props) {
		super(props);
	}

	render () {
		return (
			<div className="m-yqpayfail">
				<div className="m-header"></div>
				<div className="m-body">
					yqpayfail Component to implement
				</div>
				<div className="m-footer"></div>
			</div>
		)
	}
}


function doRender () {
	ReactDOM.render(<MyComponent /> , document.getElementById("app"));
}

setTimeout(doRender, 16);