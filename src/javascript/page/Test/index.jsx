import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import Util from "extend/common/util";
import UrlUtil from "extend/common/UrlUtil";
import RequestUtil from "extend/common/RequestUtil";
import WeixinUtil from "extend/common/WeixinUtil";
import 'scss/base.scss';
import 'scss/Test/index.scss';

class MyComponent extends Component {
	constructor (props) {
		super(props);
	}

	render () {
		return (
			<div className="m-test">
				<div className="m-header"></div>
				<div className="m-body">
					test Component to implement
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