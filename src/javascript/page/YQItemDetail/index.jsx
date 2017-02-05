import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import Util from "extend/common/util";
import RequestUtil from "extend/common/RequestUtil";
import WeixinUtil from "extend/common/WeixinUtil";
import Logger from "extend/common/Logger";
import YQGroupItemDetail from 'components/YQGroupItemDetail/YQGroupItemDetail'
import RedirectUtil from "extend/common/RedirectUtil";
import LoginUtil from "extend/login/loginUtil";
import Notification from 'components/Notification/Notification.jsx';
import 'scss/base.scss';
import 'scss/YQItemDetail/index.scss';

class MyComponent extends Component {
	constructor (props) {
		super(props);

	    this.postatus = {
	      waiting: 1, // 是未开始
	      ended: 2, //是已结束
	      during: 3, //进行中
	      soldOut: 4, //是已售罄
	      offSale: 5, //已下架
	    };
	    this.statusNoti = [
	      null,
	      '抱歉，活动未开始',
	      '抱歉，活动已结束',
	      '进行中',
	      '抱歉，该商品已售罄',
	      '抱歉，该商品已下架',
	    ];

		this.state = {
			enter: false,  //提示信息显示
			message: null,  //提示信息显示内容
		}
	}
	
	initLogin() {
		let that = this;
		let appInfo = {
			env: 'WX',
		};
		
		let extraParam = {
			pageId: 'YQItemDetail',
			queryObj: {},
			options: {},
		};
		

		LoginUtil.login({
			appInfo,
			extraParam,
		}, that.authCallback.bind(that));
	}

	authCallback(userMsg, gotStatus) {
		const {gotError, gotInfoWrong, gotNotBinded, gotInfo} = LoginUtil.loginResultStatus;
		switch(gotStatus) {
			case gotError: 
			case gotInfoWrong:
				this.enter('授权失败，请刷新页面');
				break;

			case gotNotBinded:
				this.setState({phoneBinded: false});
				break;

			case gotInfo:
				this.setState({phoneBinded: true});
				break;

			default:
				break;
		}
	}
	
	componentDidMount () {
		this.initLogin();
		WeixinUtil.hideWeixinMenu();
	}

	handleClick() {
		let {phoneBinded, postatus} = this.state;
		let redirectOpt = {
			pageName: 'YQPresentStart',
			options: {
				poSkuId: Util.fetchValueByCurrentURL('poSkuId'),
				prdtId: Util.fetchValueByCurrentURL('prdtId'),
				skuId: Util.fetchValueByCurrentURL('skuId'),
			},
		}
		
		// 若商品状态异常
		if(postatus != this.postatus.during) {
			this.enter(this.statusNoti[postatus] || '商品状态异常,请稍后再试');
			return;
		}
		
		// 若还未登陆
		if(phoneBinded === undefined) {
			this.enter('获取用户信息失败，请刷新页面');
			return;

		// 若未绑定手机
		} else if(!phoneBinded) {
			LoginUtil.toBindPhoneYQ(redirectOpt);
			return;
		}

		RedirectUtil.redirectPage(redirectOpt);
	}

	setPoStatus(status) {
		this.setState({
			postatus: status,
		})
	}

	enter(message) {
		this.setState({
			enter: true,
			message: message
		});
		setTimeout(function () {
			this.leave()
		}.bind(this), 2000)
	}

	leave() {
		this.setState({
			enter: false,
			message: ""
		});
	}

	render () {
		let prdtId = Util.fetchValueByCurrentURL('prdtId');
		return (
			<div className="m-yqitemdetail">
				<a href="javascript:void(0)">
					<YQGroupItemDetail setPoStatus={this.setPoStatus.bind(this)}/>
				</a>
				<button className="btn-present"
					onClick={this.handleClick.bind(this)}
				>加入礼盒</button>
				<Notification enter={this.state.enter} leave={this.leave.bind(this)}>{this.state.message}</Notification>
			</div>
		)
	}
}


function doRender () {
	ReactDOM.render(<MyComponent /> , document.getElementById("app"));
}

setTimeout(doRender, 16);