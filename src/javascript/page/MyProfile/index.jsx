import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import Util from "extend/common/util";
import CookieUtil from "extend/common/CookieUtil";
import RequestUtil from "extend/common/RequestUtil";
import WeixinUtil from "extend/common/WeixinUtil";
import BottomBar from "components/BottomBar/BottomBar";
import LoginUtil from "extend/login/loginUtil";
import Notification from "components/Notification/Notification";
import 'scss/base.scss';
import 'scss/MyProfile/index.scss';

class MyComponent extends Component {
	constructor(props) {
		super(props);

		const that = this;
		// CookieUtil.setCookie('userId', '404', 30*24*60*60, '/', '172.16.13.134');
		// CookieUtil.setCookie('uId', 'o7_w1wcz00qcMaR0n4EnL4JV5v2A', 30*24*60*60, '/', '172.16.13.134');

		this.state = {
			loginResultStatus: -1,
			userMsg: {
				headImg: "",
				nickName: ""
			},
			myProfileItems: [
				{
					name: "收货地址",
					linkHref: "../DeliveryAddr/index.html?funcType=edit",
				},{
					name: "联系客服",
					linkHref: "tel:0571-86927900",
				},
			],
			myOrders: [
				{
					name: "全部订单",
					type: 0,
					count: 0
				},{
					name: "待成团",
					type: 2,
					count: 0
				},{
					name: "待付款",
					type: 1,
					count: 0
				},{
					name: "待发货",
					type: 3,
					count: 0
				},{
					name: "待收货",
					type: 4,
					count: 0
				},
			],
			enter: false,
			message: '',
		}

		let appInfo = {
			env: 'WX',
		};

		let extraParam = {
			pageId: 'MyProfile',
			queryObj: {},
			options: {},
		};

		LoginUtil.login({
			appInfo,
			extraParam,
		}, that.authCallback.bind(that));
	}

	componentDidMount() {
		const that = this;

		WeixinUtil.hideWeixinMenu();
	}

	authCallback(userMsg, gotStatus) {
		this.setState({loginResultStatus: gotStatus});

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
		this.setState({
			userMsg: {
				headImg: userMsg.headImgUrl,
				nickName: userMsg.nickName								
			}
		});

		this.initOrderCount(userMsg.id);
	}

	initOrderCount(userId) {
		let param = {
			url: `order/getOrderCount`,
			method: 'GET',
			data: {
				userId: userId,
			},
			successFn: (result) => {
				if( result.code == 0) {
					let { toGroupCount, toPayCount, toSendCount, toReceiveCount } = result.result;
					this.setState({
						myOrders:[
							{
								name: "全部订单",
								type: 0,
								count: 0,
							},{
								name: "待成团",
								type: 2,
								count: toGroupCount || 0,
							},{
								name: "待付款",
								type: 1,
								count: toPayCount || 0,
							},{
								name: "待发货",
								type: 3,
								count: toSendCount || 0,
							},{
								name: "待收货",
								type: 4,
								count: toReceiveCount || 0,
							},
						]
					})
				} else {
					this.enter(result.message);
				}
			},
			errorFn: () => {
				console.error(arguments)
			}
		}
		RequestUtil.fetch(param);
	}

  /**
   * 提示组件Notification消失
   * @return {[type]} [description]
   */
  leave() {
    this.setState({
      enter: false
    });
  }

  /**
   * 提示组件Notification出现，2s后自动消失
   * @return {[type]} [description]
   */
  enter(message = '登录失败，请稍后再试') {
    this.setState({
      enter: true,
      message,
    });
    setTimeout(function () {
      this.leave()
    }.bind(this), 5000)
  }

	render() {
		const {gotError, gotInfoWrong, gotNotBinded, gotInfo} = LoginUtil.loginResultStatus;
		if(this.state.loginResultStatus == -1) 
			return <div></div>
		else if(this.state.loginResultStatus == gotError || this.state.loginResultStatus == gotInfoWrong)
			return <div></div>

		let myOrders= this.state.myOrders.map(function(listItem,index){
			let count = (listItem.type > 0 && listItem.count > 0) ? 
						<b className="list-item-count">{listItem.count}</b> 
						: null;
			return <a href={"../OrderList/index.html?type="+listItem.type} key={index} className="orderItem-container">
						<i className={'icon icon-'+index}></i>
						<span>{listItem.name}</span>
						{count}
					</a>
		});

		let myProfileItems = this.state.myProfileItems.map(function(item,index){
			return <li key={index}>
						<a href={item.linkHref} className="item-container">
							<b className={"item-head-icon icon-"+index}></b>
							<span className="item-name">{item.name}</span>
							<b className="item-arrows-icon"></b>
						</a>
					</li>
		});

		return (
			<div className="m-myprofile">
				<div className="my-profile-userInfo">
					<div className="head-img">
						{ !!this.state.userMsg.headImg && <img src={this.state.userMsg.headImg} alt="暂无图片"/>}
					</div>
					<div className="nick-name">{this.state.userMsg.nickName}</div>
				</div>

				<div className="m-body">
					<div className="my-profile-order">
						{myOrders}
					</div>

					<ul className="my-profile-items">
						{myProfileItems}
					</ul>
				</div>
				<BottomBar activeIndex='3'/>
          		<Notification enter={this.state.enter} leave={this.leave.bind(this)}>{this.state.message}</Notification>
			</div>
		)
	}
}


function doRender () {
	ReactDOM.render(<MyComponent /> , document.getElementById("app"));
}

setTimeout(doRender, 16);