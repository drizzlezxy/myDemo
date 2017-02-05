import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import Util from "extend/common/util";
import RequestUtil from "extend/common/RequestUtil";
import WeixinUtil from "extend/common/WeixinUtil";
import Cart from "components/Cart/Cart";
import BottomBar from "components/BottomBar/BottomBar";
import 'scss/base.scss';
import 'scss/Cart/index.scss';

class MyComponent extends Component {
	constructor() {
		super();
		this.state = {
			isEmpty: true
		}
	}

	componentDidMount() {
		this.bindEvent();
	}

	setEmptyStatus(value) {
		this.setState({
			isEmpty: value
		})
	}

	bindEvent() {
		window.addEventListener("scroll", (e) => {
			Util.throttleV2(this.setTop, 20, 50, this)()
		})
	}

	/**
	 * top按钮显示控制
	 */
	setTop() {
		var scrollTop = document.body.scrollTop,
			baseSize = parseInt(document.documentElement.style.fontSize, 10);
	}

	render() {
		return (
			<div>
				<Cart setEmptyStatus={this.setEmptyStatus.bind(this)} />
			</div>
		)
	}
}


function doRender () {
	ReactDOM.render(<MyComponent /> , document.getElementById("app"));
}

setTimeout(doRender, 16);