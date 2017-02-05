import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import Util from "extend/common/util";
import RequestUtil from "extend/common/RequestUtil";
import WeixinUtil from "extend/common/WeixinUtil";
import PaySuccess from "components/PayStatus/PaySuccess";

import 'scss/base.scss';
import 'scss/PaySuccess/index.scss';

class MyComponent extends Component {
	constructor(props) {
		super(props);
	}

	componentDidMount() {
		WeixinUtil.hideWeixinMenu();
	}

	render() {
		return (
			<div className="m-pay-status">
      			<PaySuccess />
			</div>
		)
	}
}

function doRender () {
	ReactDOM.render(<MyComponent /> , document.getElementById("app"));
}

setTimeout(doRender, 16);