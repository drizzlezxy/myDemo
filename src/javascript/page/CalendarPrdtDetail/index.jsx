import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import Util from "extend/common/util";
import RequestUtil from "extend/common/RequestUtil";
import WeixinUtil from "extend/common/WeixinUtil";
import 'scss/base.scss';
import 'scss/CalendarPrdtDetail/index.scss';

class MyComponent extends Component {
	constructor (props) {
		super(props);

		this.state = {
			prdtId: -1,
		};
	}

	componentDidMount() {
		let prdtId = Util.parseQueryString(location.href)['prdtId'];
		this.setState({
			prdtId: prdtId,
		}, () => {
			$('img').on('load', function() {
				$(this).css({
					transition: 'all .3s ease-in-out',
					webkitTransition: 'all .3s ease-in-out',
					opacity: 1,
				}, 800);
			});
		});
	}

	render () {
		let {prdtId} = this.state;
		let prdtSrc = `../../../../res/images/CalendarNav/detail/${prdtId}.jpg`;

		return (
			<div className="m-calendarprdtdetail">
				<div className="m-header"></div>
				<div className="m-body">
					<img src={prdtSrc} className="detail-image"/>
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