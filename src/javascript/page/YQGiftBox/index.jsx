import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import Util from "extend/common/util";
import RequestUtil from "extend/common/RequestUtil";
import RedirectUtil from 'extend/common/RedirectUtil';
import WeixinUtil from "extend/common/WeixinUtil";
import LoginUtil from "extend/login/loginUtil";
import Logger from "extend/common/Logger";
import CookieUtil from "extend/common/CookieUtil";

import YQPwdInput from "components/YQPwdInput/YQPwdInput";
import Notification from "components/Notification/Notification";
import CONSTANTS from 'constants/YQconstants.json';
import Sha1 from "extend/algorithm/Sha1.jsx";

import 'scss/base.scss';
import 'scss/YQGiftBox/index.scss';

class MyComponent extends Component {
	constructor (props) {
		super(props);
		this.boxStatus = {
			waiting: 1001, 	// 未获取红包信息
			canOpen: 1002,	// 红包有效
			overdue: 30040052,		// 过期
			hasPwd: 2001,		// 需要输入口令
			// hasQues: 2002,		// 需要回答问题
		}
		this.state = {
			boxStatus: this.boxStatus.waiting,
			enter: false,
			message: '',
			userName: '',
			pwdType: null,
		}
	}

	componentDidMount() {
    	this.initAuth();
		WeixinUtil.hideWeixinMenu();
	}

	initAuth() {
		let that = this;
		let appInfo = {
			env: 'WX',
		};

		let queryObj = Util.parseQueryString(location.href);
		let extraParam = {
			pageId: 'GroupItemDetail',
			queryObj: {},
			options: {},
		};

		LoginUtil.login({
			appInfo,
			extraParam,
		}, that.authCallback.bind(that));
	}

	authCallback(userMsg, gotStatus, callback) {
		const {gotError, gotInfoWrong, gotNotBinded, gotInfo} = LoginUtil.loginResultStatus;
		switch(gotStatus) {
			case gotError: 
			case gotInfoWrong:
				this.enter('授权失败，请刷新页面');
				break;

			case gotNotBinded:
				// LoginUtil.toBindPhoneYQ();
			case gotInfo:
				this.initBoxInfo();
				callback && callback();
				break;

			default:
				break;
		}
	}

	initBoxInfo() {
		const that = this;
		let param = {
			url : 'gift/open',
			method : 'GET',
			data: {
				giftId: Util.fetchValueByCurrentURL('giftId'),
				userId: Util.fetchUserId(),
			},
			successFn : function (result) {
                if (RequestUtil.isResultSuccessful(result)) {
                	let {userName, giftStrategyId, type, ctoken} = result.result;
                	that.setState({
						boxStatus: that.boxStatus.canOpen,
						userName,
						pwdType: (giftStrategyId != null) ? ((2000 + type) || 2001) : null,
					});

					// Fix ME: 线上修复 打开礼盒验证
                	CookieUtil.setCookie("ctoken",ctoken,24*60*60, '/', window.location.hostname);

                }else{
					if(result.code == that.boxStatus.overdue) {
						that.setState({
							boxStatus: that.boxStatus.overdue,
						})
					} else {
						that.enter(CONSTANTS.ERRORMSG[result.code] || result.message);
					}
                }
			},
			errorFn : function () {
				that.enter("网络错误，请稍后再试");
			}
		};
		RequestUtil.fetchYQ(param);

	}

	handleOpenClick () {
		if(!this.state.pwdType) {
			RedirectUtil.redirectPage({
				pageName: 'YQOpenGift',
				options: {
					giftId: Util.fetchValueByCurrentURL('giftId'),
				},
			});
			return;
		}
		this.setState({
			boxStatus: this.state.pwdType,
		})
	}

	doCheckPwd(pwd, callback) {
		const that = this;
		let param = {
			url : 'gift/check',
			timeout:3000,
			method : 'POST',
			data: {
				giftId: Util.fetchValueByCurrentURL('giftId'),
				enter: (new Sha1).hex_sha1(pwd),
				userId: Util.fetchUserId(),
			},
			successFn : function (result) {
                if (RequestUtil.isResultSuccessful(result)) {
					callback['success'] && callback['success']();

					// Fix ME: 线上修复 打开礼盒验证
                	CookieUtil.setCookie("ctoken",result.result.ctoken,24*60*60, '/', window.location.hostname);

                	RedirectUtil.redirectPage({
                		pageName: 'YQOpenGift',
                		options: {
							giftId: Util.fetchValueByCurrentURL('giftId'),
                		},
                	})

                }else{
					that.enter(CONSTANTS.ERRORMSG[result.code] || result.message);

					callback['fail'] && callback['fail']();
                }
			},
			errorFn : function () {
				callback['fail'] && callback['fail']();
				that.enter("网络错误，请稍后再试");
			},
			completeFn : function(ajaxObj,status){ // 请求完成后最终执行参数
		　　　　if(status == 'timeout'){ //超时,status还有success,error等值的情况
					ajaxObj.abort();
		　　　　　  that.enter("网络超时，请稍后再试");
		　　　　}
		　　}
		};
		RequestUtil.fetchYQTimeout(param);
	}

	getContent() {
		const that = this;
		let {waiting, overdue, hasPwd, canOpen} = that.boxStatus;

		let {boxStatus, userName} = that.state;
		switch(boxStatus) {
			case waiting: 
				return <div></div>

			case canOpen:
				return (
					<div className="content closed">
						<button className="btn-open" onClick={that.handleOpenClick.bind(that)}></button>
						<div className="txt-who">{userName || '您的好友'}给您发了一个礼盒</div>
					</div>
				)
				break;

			case overdue:
				return (
					<div className="content closed">
						<div className="txt-who">您已错过领取礼盒的时间哦~</div>
					</div>
				)
				break;

			case hasPwd:
				let checkPwd = (pwd, callback) => {
					that.doCheckPwd.call(that, pwd, callback);
				}

				let exceed = () => {
					that.enter(CONSTANTS.MSG.GIFT.EXCEED);
				}
				return (
					<div className="content hasPwd">
						<div className="txt-noti">该礼盒需要口令才能打开哟</div>
						<YQPwdInput checkPwd={checkPwd.bind(that)} exceed={exceed.bind(that)}/>
					</div>
				)
				break;

			default:
				this.setState({
					boxStatus: this.boxStatus.waiting,
				})
				break;
		}
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
		if(this.state.boxStatus === this.boxStatus.waiting) {
			return <div className="API-error">
				<Notification enter={this.state.enter} leave={this.leave.bind(this)}>{this.state.message}</Notification>
			</div>
		}
				
		let content = this.getContent();
		return (
			<div className="m-yqgiftbox">
				{content}
				<Notification enter={this.state.enter} leave={this.leave.bind(this)}>{this.state.message}</Notification>
			</div>
		)
	}
}


function doRender () {
	ReactDOM.render(<MyComponent /> , document.getElementById("app"));
}

setTimeout(doRender, 16);