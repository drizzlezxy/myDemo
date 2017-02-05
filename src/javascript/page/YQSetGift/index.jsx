import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import Util from "extend/common/util";
import RequestUtil from "extend/common/RequestUtil";
import RedirectUtil from "extend/common/RedirectUtil";
import WeixinUtil from "extend/common/WeixinUtil";
import Logger from "extend/common/Logger";
import PayUtil from "extend/common/PayUtil";
import CookieUtil from "extend/common/CookieUtil";
import Sha1 from "extend/algorithm/Sha1.jsx";

import YQSetCustom from "components/YQSetCustom/YQSetCustom";
import Notification from 'components/Notification/Notification';
import shareData from "data/YQData/shareData.json";

import 'scss/base.scss';
import 'scss/YQSetGift/index.scss';

class MyComponent extends Component {
	constructor (props) {
		super(props);
		this.state={
          	benediction:"",
            "payEnabled":true,
            "password":"",
            "autoFocus":["false","false","false","false"],
            enter: false,
			message: ''
        }
	}

	updateState(text) {
		this.setState({
			"benediction":text
		});
	}
	
	setPayButtonDisabled(callback) {
		this.setState({
			payEnabled: false,
		}, () => {
			callback && callback();
		});
	}


	componentDidMount() {
		// FIXME: 【Android】【编辑礼盒页】不可以分享
		WeixinUtil.hideWeixinMenu();
	}


	setPayButtonabled() {
		this.setState({
			payEnabled: true,
		});
	}
	
	/**
	 * [validateBeforePay 支付之前验证数据]
	 * @return {[type]} [description]
	 */
	validateBeforePay() {
		let that = this;
		return true;
	}
	
	/**
	 * [handlePay 点击支付处理入口]
	 * @return {[type]} [description]
	 */
	handlePay() {
		let that = this;
		let _giftId = Util.parseQueryString(window.location.href).giftId;
		
		if (!Util.isOldOrder()) {

			let commitNormalBuySuccessFn = (data) => {
				let {
					orderId,
				} = data.result;

				// 微信支付
				PayUtil.wxPay(data.result, (errorCode, option) => {
					// 用户取消后跳转到一起请SKU商品列表页面
					
					if (errorCode != 'SUCCESS') {
						RedirectUtil.redirectPage({
							pageName: 'YQPrdtList',
							options: {},
						});
					} 

					PayUtil.doPostPay2(errorCode, option, (result) => {
						// jump to pay success page
						let pageName;
						if (errorCode === 'SUCCESS') {
							pageName = 'YQPaySuccess';
						} else {
							pageName = 'YQPrdtList';
						}

						RedirectUtil.redirectPage({
							pageName: pageName,
							options: Object.assign({
								orderId: orderId,
								giftId:  _giftId
							}, {}),
						});
					});
					
				});
			};

			if (this.validateBeforePay()) {
				this.setPayButtonDisabled(() => {
					this.doPay(commitNormalBuySuccessFn, (data) => {
						this.showNotification(data.message);
					});
					
				});
			}
		} else {
			// recommit
			this.setPayButtonDisabled(() => {
				this.handleRecommit((data) => {
					PayUtil.wxPay(data.result, (errorCode, option) => {
						
						// 用户取消后跳转到待支付定单
						if (errorCode != 'SUCCESS') {
							RedirectUtil.redirectPage({
								pageName: 'OrderList',
								options: Object.assign({
									type: 1,
								}, {}),
							});
						}

						PayUtil.doPostPay(errorCode, option, (result) => {
							let pageName;
							if (errorCode === 'SUCCESS') {
								pageName = 'PaySuccess';
							} else {
								pageName = 'PayFail';
							}

							// 普通商品跳转
							RedirectUtil.redirectPage({
								pageName: pageName,
								options: Object.assign({
									orderId: Util.fetchValueByCurrentURL('orderId'),
								}, {}),
							});

						});
					});
				}, (data) => {
					// error
					this.showNotification(data.message);
				});
			});
		}
	}
		
	/**
	 * [getPayParamDataByType 提交订单-点击支付前参数验证]
	 * @param  {[type]} paramType [description]
	 * @return {[type]}           [description]
	 */
	getPayParamDataByType(paramType) {
		let that = this;
		let benediction = this.state.benediction;
		let passWord    = this.state.password;
		let _benediction = (this.state.benediction === "" ) ? shareData.defaultTitle : this.state.benediction;

		CookieUtil.setCookie("benediction",_benediction,30*24*60*60, '/', window.location.hostname);
		CookieUtil.setCookie("passWord",this.state.password.split('').join(',').toString(),30*24*60*60, '/', window.location.hostname);

		let paramObj    = Util.parseQueryString(location.href);
		let giftId      = paramObj.giftId;
		let totalPrice  = paramObj.price;

		let payParamData= {};
		
		if(paramType === 'normal') {
			let len = passWord.length;
			if(len >= 1 && len < 4) {
				that.showNotification("请输入4位密码或者不输入密码");
			}else{
				payParamData = {
						giftId:giftId,
						passWord:(passWord == "" ) ? "" : ((new Sha1).hex_sha1(passWord)),
						benediction: benediction,
						userId: Util.fetchUserId(),
						finalPrice: totalPrice,
						payChannel: 2,
						promotionType:3,
						openId: Util.fetchOpenId(),
						orderSource:Util.webSource()

				};
				
			}
		}
		
		return payParamData;

	}
	
	showNotification(message, timeout = 3000) {
		this.setState({
			enter: true,
			message: message,
		}, () => {
			setTimeout(() => {
				this.leave();
			}, timeout);
		});
	}
	
	

	leave() {
		this.setState({
		  enter: false,
		});
	}



	doPay(successFn, errorFn) {
		let that = this;
		let payParamData = this.getPayParamDataByType('normal');
		
		if(payParamData.hasOwnProperty("giftId")) {
			let payParam = {
				url: 'order/commitGiftOrder',
				method: 'POST',
				data: payParamData,
				successFn: (data) => {
					if (RequestUtil.isResultSuccessful(data)) {
						successFn && successFn(data);
						// 只有code = 0表示第一次支付,才可以弹出支付窗口，对于已经支付的就不会再执行毁掉的successFn方法.
					} else if(data.code == 501 ) {
						that.showNotification(data.message+"请勿重新支付~");
					} 
					else{
						errorFn && errorFn(data);
					}
				},
				errorFn: (...args) => {
					this.showNotification('网络异常，请检查网络');
				},
			};

			this.setPayButtonDisabled(() => {
				RequestUtil.fetchYQ(payParam);
			});
		}
		else {
			this.setPayButtonabled();
		}
		
		
	}

	buildPayButotn() {
		let {
			payEnabled,
		} = this.state;

		if (payEnabled) {
			return (
				<div onClick={this.handlePay.bind(this)} className="btn btn-pay">
					立即支付
				</div>
			)
		} else {
			return (
				<div className="btn btn-pay disabled">
					立即支付
				</div>
			)
		}
	}
	
	/**
	 * [handleChangePwd 更新红包口令的state]
	 * @param  {[type]} type [description]
	 * @return {[type]}      [description]
	 */
	handleChangePwd() {
		let that = this;
		let val = Util.OnlyInt(that.refs.hid_input.value,4);

		this.setState({
			password:val
		});	
		
	}
	
	BindShowPwd() {
		let that = this;
		if(this.state.password.length == 4) {
			this.setState({
				password:"",
			});
		}
		ReactDOM.findDOMNode(this.refs.hid_input).focus();
	}

	render () {
		let that = this;
		let updateState =function(text){
			that.updateState(text);
		}
		
		let payButton = this.buildPayButotn();
		let pwd = that.state.password;
		let pwdarr = pwd.split('');
		
		let _style = {
			position:'absolute',
			bottom:'0',
			width:'100%'

		}

		return (
			<div className="m-yqsetgift">
				<div className="m-body">
					<YQSetCustom benediction={this.state.benediction} updateState={updateState}></YQSetCustom>
					<div className="m-set-pwd">
						<div className="head">
							设置礼盒口令
						</div>
						<input type="number" id="hid_input" name="hid_input" ref="hid_input" className="hid_input" value={this.state.password} onChange={this.handleChangePwd.bind(this)}/>
						<div className="m-pwd-input" onClick={that.BindShowPwd.bind(this)}>
							
							<div className="item" >
								<span className="pwdnum">{pwdarr[0]}</span>
							</div>
							<div className="item" >
								<span className="pwdnum">{pwdarr[1]}</span>
							</div>
							<div className="item" >
								<span className="pwdnum">{pwdarr[2]}</span>
							</div>
							<div className="item" >
								<span className="pwdnum">{pwdarr[3]}</span>
							</div>
						</div>
					</div>
					<Notification enter={this.state.enter} leave={this.leave.bind(this)}>{this.state.message}</Notification>
				</div>
				<div className="m-footer" style={_style} >
					{payButton}
				</div>
			</div>
		)
	}
}


function doRender () {
	ReactDOM.render(<MyComponent /> , document.getElementById("app"));
}

setTimeout(doRender, 16);