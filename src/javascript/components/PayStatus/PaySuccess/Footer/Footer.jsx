import React, {Component} from 'react';
import Util from "extend/common/util";
import './Footer.scss';

export default class Footer extends Component {
	handleClick (strategy) {
		let strategies = {
			'viewOrder' : function () {
				// let detailId = Util.fetchParamValueByCurrentURL('detailId');
				let targetUrl = 'http://yougo.xinguang.com/fightgroup-web/public/build/wxPages/OrderDetail/index.html';

				// targetUrl = Util.appendParam4Url(targetUrl, 'detailId', detailId);

				location.href = targetUrl;
			},
			'back2List' : function () {
				location.href = 'http://yougo.xinguang.com/fightgroup-web/public/build/wxPages/RouteThumbnail/index.html';
			}
		};

		strategies[strategy]();
	}

	render () {
		return (
			<div className="m-footer">
				<div className="u-btn-group">
					<button onClick={this.handleClick.bind(this, 'viewOrder')} className="btn btn-view">查看订单</button>
					<button onClick={this.handleClick.bind(this, 'back2List')} className="btn btn-home">返回首页</button>
				</div>
			</div>
		)
	}
}