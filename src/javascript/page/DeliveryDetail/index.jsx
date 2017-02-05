import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import Util from "extend/common/util";
import RequestUtil from "extend/common/RequestUtil";
import WeixinUtil from "extend/common/WeixinUtil";
import 'scss/base.scss';
import 'scss/DeliveryDetail/index.scss';

class MyComponent extends Component {
	constructor (props) {
		super(props);
	}

	render () {
		return (
			<div className="m-deliverydetail">
				<div className="m-header"></div>
				<div className="m-body">
					deliverydetail Component to implement
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