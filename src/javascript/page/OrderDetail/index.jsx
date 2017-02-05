import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import Util from "extend/common/util";
import RequestUtil from "extend/common/RequestUtil";
import Logger from "extend/common/Logger";
import WeixinUtil from "extend/common/WeixinUtil";
import OrderDetailPrdtList from "components/OrderDetailPrdtList/OrderDetailPrdtList";
import 'scss/base.scss';
import 'scss/OrderDetail/index.scss';


import OrderDetailState from 'states/OrderDetailState';
class MyComponent extends Component {
	constructor (props) {
		super(props);

		this.state = OrderDetailState;
	}

	componentDidMount() {
		WeixinUtil.hideWeixinMenu();
		
	}

	handleClick(clickType, orderStatus, orderId) {
		Logger.log(clickType, orderStatus, orderId);
	}

	buildBtnContents(orderStatus, orderId) {
		let that = this;
		let genButtonStretagy = {
			'READY': (orderStatus, orderId) => {

				return (
					<div className="btn-group clearfix">
						<a href="tel:008822323" className="btn dial">
							<span className="phone"></span>
							客服
						</a>

						<div onClick={that.handleClick.bind(that, 'viewGroupDetail', orderStatus, orderId)} className="btn btn-view f-fr">
							查看团详情
						</div>

						<div onClick={that.handleClick.bind(that, 'viewDelivery', orderStatus, orderId)} className="btn f-fr">
							查看物流
						</div>
					</div>
				)
			}
		};

		return genButtonStretagy['READY'](orderStatus, orderId);
	}

	render () {
		let {
			forms,
			orderStatus,
			orderId,
			itemList,
			prdtList,
		} = this.state;
		let that = this;
		let infoTableContent = forms.map((blocks, index) => {
			return blocks.map((line, trIndex) => {
				let {
					id,
					name,
					label,
					value,
					display,
					extra,
					highlight,
				} = line;
				let trKey = `${index}-${trIndex}`;
				let lineClazz = display ? '': 'hide';

				return (
					<tr key={trKey} className={lineClazz}>
						<td className="cell-attr">{label}</td>
						<td className="cell-val">{value}{extra}</td>
					</tr>
				);
			});
		});

		let btnContents = this.buildBtnContents(orderStatus, orderId);
		return (
			<div className="m-orderdetail">
				<div className="m-header"></div>
				<div className="m-body">
					<div className="order-info">
						<table><tbody>{infoTableContent}</tbody></table>
					</div>
					<OrderDetailPrdtList 
						prdtList={prdtList}
					/>

					<div className="order-footer">
						{btnContents}
					</div>
				</div>
			</div>
		)
	}
}


function doRender () {
	ReactDOM.render(<MyComponent /> , document.getElementById("app"));
}

setTimeout(doRender, 16);