import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import Util from "extend/common/util";
import RequestUtil from "extend/common/RequestUtil";
import WeixinUtil from "extend/common/WeixinUtil";
import Tab from 'components/Tab/Tab';
import OrderList from "components/OrderList/OrderList";
import Logger from 'extend/common/Logger';
import LoginUtil from 'extend/login/loginUtil';
import 'scss/base.scss';
import 'scss/OrderList/index.scss';
import OrderListState from 'states/OrderListState';
import OrderAdaptor from 'extend/adaptor/OrderAdaptor';
import Hammer from 'extend/hammer.min.js';
import Rodal from 'components/modal/modal.js'

class MyComponent extends Component {
	constructor (props) {
		super(props);
		
		let newState = OrderListState;
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

	init() {
		let type = Util.fetchValueByCurrentURL('type');
		
		if (!Util.isExisty(type)) {
			type = 0;
		}

		this.initTab(type);

		this.resetOrderList(type);

		this.initSwipe();
	}

	initSwipe() {
		let ref = this.refs['swipe'];
		let hammer = new Hammer(ref, {});

		hammer.on('swipeleft', function () {
			let {tabTree: {
				activeIndex,
				items,
			}} = this.state;

			let next = activeIndex + 1 >= items.length ? 0 : activeIndex + 1;
			let prev = activeIndex - 1 < 0 ? items.length - 1 : activeIndex - 1;
	      	this.handleTopTabChange('', next);
	    }.bind(this));
	    hammer.on('swiperight', function () {
	    	let {tabTree: {
				activeIndex,
				items,
			}} = this.state;

			let next = activeIndex + 1 >= items.length ? 0 : activeIndex + 1;
			let prev = activeIndex - 1 < 0 ? items.length - 1 : activeIndex - 1;
	    	this.handleTopTabChange('', prev);
	    }.bind(this));
	}

	initTab(type) {
		let tabTree = Util.deepClone(this.state.tabTree);
		tabTree.activeIndex = type;

		this.setState({
			tabTree,
		});
	}

	initAuth() {
		let appInfo = {
			env: 'WX',
		};

		let queryObj = Util.parseQueryString(location.href);
		let extraParam = {
			pageId: 'OrderList',
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
		console.log('userMsg', userMsg);
	}

	resetOrderList(type) {
		let param = {
			url: 'order/getOrderList',
			method: 'POST',
			data: {
				userId: Util.fetchUserId(),
				type,
			},
			successFn: (data) => {
				if (RequestUtil.isResultSuccessful(data)) {
					let result = data.result;
					this.renderOrderList(result, type);
				}
			},
			errorFn: () => {
				//alert('网络异常，请检查网络');
			},
		};
		RequestUtil.fetch(param);
	}

	renderOrderList(result, type) {
		let resultList = result.list;
		let orderList = resultList.map((order, index) => {
			return new OrderAdaptor(order).getData();
		});

		let tabTree = Util.deepClone(this.state.tabTree);
		tabTree.activeIndex = type;

		this.setState({
			tabTree,
			orderList,
			currentList: orderList,
		});
	}

	handleTopTabChange(tabText, tabIndex) {
		let {
			tabTree,
		} = this.state;
		if (tabTree.activeIndex == tabIndex) {
			return;
		}
		
		this.resetOrderList(tabIndex);
	}


	handleRefresh() {
		let {tabTree: {
			activeIndex,
		}} = this.state;

		this.resetOrderList(activeIndex);
	}

	setModalInfo(modalInfo = {
					visible: false,
					animation: 'zoom',
					msg: '', 
					handleClick: null,}) {
		this.setState({modalInfo});
	}
	
	handleModalClick(type, callback) {
		setTimeout(function () {
			this.hide();
		}.bind(this), 100)

		//确定
		if(type === 0) {
			callback();

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
	
	render () {
		let that = this;
		let {
			currentList,
			tabTree:{activeIndex, items}
		} = this.state;
		let currentTopTabItems = items[activeIndex];
		let {display} = currentTopTabItems;
		let topTabStatus = items.map(function (item, index){
			return item.label;
		}).filter(function (item) {
			return !item.display;
		});

		let {visible, animation, msg, handleClick}= this.state.modalInfo;
		let modal = (
			<div className="m-modal">
				<div className="row1">{msg}</div>
				<div className="row2">
					<div className="item yes" onClick={this.handleModalClick.bind(this, 0, handleClick)}>确定</div>
					<div className="item no" onClick={this.handleModalClick.bind(this, 1)}>取消</div>
				</div>
			</div>
		)

		return (
			<div className="m-orderlist">
				<div className="m-header">
					<Tab 
						ref="topTab"
						isTopTab={true}
						display={true}
						tabs={topTabStatus} 
						activeIndex={activeIndex}
						context={that}
						handleItemClick={this.handleTopTabChange.bind(this)}
					/>
				</div>
				<div ref="swipe" className="m-body">
					<OrderList 
						orderList={currentList}
						handleRefresh={this.handleRefresh.bind(this)}
						setModalInfo={this.setModalInfo.bind(this)}
					/>
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