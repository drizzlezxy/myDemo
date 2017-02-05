import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import Util from "extend/common/util";
import RequestUtil from "extend/common/RequestUtil";
import Logger from "extend/common/Logger";
import LoginUtil from "extend/login/loginUtil";
import RedirectUtil from "extend/common/RedirectUtil";
import WeixinUtil from "extend/common/WeixinUtil";
import OrderDetailPrdtList from "components/OrderDetailPrdtList/OrderDetailPrdtList";
import 'scss/base.scss';
import 'scss/OrderDetail2/index.scss';
import OrderDetailState from 'states/OrderDetailState2';
import OrderDetail2Adaptor from 'extend/adaptor/OrderDetail2Adaptor';
import Rodal from 'components/modal/modal.js'

class MyComponent extends Component {
	constructor (props) {
		super(props);

		let newState = OrderDetailState;
		newState.modalInfo = {
			visible: false,
			animation: 'zoom',
			msg: '', 
			handleClick: null,
		};
		this.state = newState;
	}

	componentDidMount() {
		WeixinUtil.hideWeixinMenu();

		this.initAuth();
		//this.init();
	}

	initAuth() {
		let appInfo = {
			env: 'WX',
		};

		let queryObj = Util.parseQueryString(location.href);
		let extraParam = {
			pageId: 'ConfirmOrder',
			queryObj: queryObj,
			options: {},
		};

		LoginUtil.login({
			appInfo,
			extraParam,
		}, (userMsg, gotStatus) => {
			this.authCallback(userMsg, gotStatus);
			this.init();
		});
	}

	init() {
		let param = {
			url: 'order/getOrderDetail',
			data: {
				userId: Util.fetchUserId(),
				orderId: Util.fetchValueByCurrentURL('orderId'),
				promotionType: Util.fetchValueByCurrentURL('promotionType') || 0,
			},
			successFn: (data) => {
				if (RequestUtil.isResultSuccessful(data)) {
					this.resetOrderDetail(data.result.orderDetail);
				} else {
					Logger.error('error occurs in orderGetOrderDetail method');
				}
			},
			errorFn: (...args) => {
				Logger.error(args);
			},
		}

		RequestUtil.fetch(param);
	}


	authCallback(userMsg, gotStatus) {
		const {gotError, gotInfoWrong, gotNotBinded, gotInfo} = LoginUtil.loginResultStatus;
		switch(gotStatus) {
			case gotError: 
			case gotInfoWrong:
				break;

			case gotNotBinded:
				LoginUtil.toBindPhone();
				break;

			case gotInfo:
				this.setUserInfo(userMsg);
				break;

			default:
				break;
		}
	}

	setUserInfo(userMsg) {

	}

	resetOrderDetail(data) {
		let newOrderState = new OrderDetail2Adaptor(data).getData();

		this.setState(newOrderState, () => {
			Logger.log('New order state has been successfully set');
		});
		Logger.log('orderDetail', data);
	}

	handleClick(clickType, orderStatus, orderId) {
		Logger.log(clickType, orderStatus, orderId);
	}

	buildTableThroughInfo({type, info}) {
		let tableClazz = `m-${type}`;
		let tableContent = info.map((row, rowIndex) => {
			let cellsContent = row.map((cell, cellIndex) => {
				let cellKey = `${rowIndex}-${cellIndex}`;
				let cellContent = cell.value.map((cv, cvIndex) => {
					return (
						<span key={cvIndex} className="cell-value">
							{cv}
						</span>
					)
				});

				let handleLineClick = () => {
					if (cell.label == '物流信息' && cell.value.join('') == '点击查看') {
						RedirectUtil.redirectPage({
							pageName: 'ViewDeliveryDetail',
							options: {
								orderId: Util.fetchValueByCurrentURL('orderId'),
							}
						});
					}
				};

				return (
					<tr onClick={handleLineClick} key={rowIndex} className="row">
						<td className="cell-attr">{cell.label}</td>
						<td key={cellKey} className="cell-val">
							{cellContent}
						</td>
					</tr>
				)
			});
			return (
				<tbody>
					{cellsContent}
				</tbody>
			)
		});
		let table = (
			<table className={tableClazz}>
				{tableContent}
			</table>
		);
		return table;
	}

	buildAddressInfoTable(info) {
		return this.buildTableThroughInfo({
			type: 'address',
			info,
		});
	}

	buildDiliveryInfoTable(info) {
		return this.buildTableThroughInfo({
			type: 'delivery',
			info,
		});
	}

	buildPayInfoTable(info) {
		return this.buildTableThroughInfo({
			type: 'pay',
			info,
		});
	}

	handleConfirm() {
		let that = this;
		that.setState({
			modalInfo: {
				visible: true,
				animation: 'zoom',
				msg: '是否确认收货',
			}
		});
	}

	doConfirm() {
		let orderId = Util.fetchValueByCurrentURL('orderId');
		let param = {
			url: 'order/confirmReceipt',
			data: {
				orderId,
				userId: Util.fetchUserId(),
			},
			successFn: (data) => {
				if (RequestUtil.isResultSuccessful(data)) {
					location.href = location.href;
				}
			},
			errorFn: () => {

			},
		};

		RequestUtil.fetch(param);
	}

	buildButtonContent(orderStatus) {
		if (orderStatus == 4) {
			// 已发货的才有确认收货操作
			return (
				<button 
					onClick={this.handleConfirm.bind(this)}
					className="btn btn-confirm">
					确认收货
				</button>
			)
		} else {
			return null;
		}
	}
	
	handleModalClick(type) {
		setTimeout(function () {
			this.hide();
		}.bind(this), 100)

		//确定
		if(type === 0) {
			this.doConfirm();

		}
		//取消
		if(type === 1) {

		}
	}
	
	hide() {
		let clonedModalInfo = Util.deepClone(this.state.modalInfo);
		clonedModalInfo.visible = false;
		this.setState({
			modalInfo: clonedModalInfo,
		})
	}

	isYQQTreat(promotionType, orderStatus) {
		// promotionType = 3 为一起请订单
		// orderStatus = 1 为待支付， orderStatus = 2 为已支付
		return (promotionType == 3) && (orderStatus <= 2)
	}

	render () {
		let {
			deliveryInfo,
			payInfo,
			addressInfo,
			orderStatus,
			prdtList,
			logisticsType,
			shopName,
			promotionType,
		} = this.state;

		let addressInfoTable = this.buildAddressInfoTable(addressInfo);
		let deliveryInfoTable = this.buildDiliveryInfoTable(deliveryInfo);
		let payInfoTable = this.buildPayInfoTable(payInfo);

		let buttonContent = this.buildButtonContent(orderStatus);

		let {visible, animation, msg}= this.state.modalInfo;
		let modal = (
			<div className="m-modal">
				<div className="row1">{msg}</div>
				<div className="row2">
					<div className="item yes" onClick={this.handleModalClick.bind(this, 0)}>确定</div>
					<div className="item no" onClick={this.handleModalClick.bind(this, 1)}>取消</div>
				</div>
			</div>
		)

		let orderDetailHeader = this.isYQQTreat(promotionType, orderStatus) ?
			'' : 
			(<div className="m-header">
				<div className="address-info">
					{addressInfoTable}
				</div>
			</div>);

		return (
			<div className="m-orderdetail2">
				{orderDetailHeader}
				<div className="m-body">
					
					<OrderDetailPrdtList 
						logisticsType={logisticsType}
						shopName={shopName}
						promotionType={promotionType}
						orderStatus={orderStatus}
						prdtList={prdtList}
					/>

					<div className="pay-info">
						{payInfoTable}
					</div>
					<div className="order-footer">
						<div className="btn-group pull-right">
							{buttonContent}
						</div>
					</div>
				</div>
				<div className="m-footer">
					<div className="delivery-info">
						{deliveryInfoTable}
					</div>
				</div>
				
				<Rodal width={2.5} visible={visible} onClose={this.hide.bind(this)} animation={animation} showCloseButton={false}>
					{modal}
				</Rodal>
			</div>
		)
	}
}


function doRender () {
	ReactDOM.render(<MyComponent /> , document.getElementById("app"));
}

setTimeout(doRender, 16);