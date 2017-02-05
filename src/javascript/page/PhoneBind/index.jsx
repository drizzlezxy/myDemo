import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import Util from "extend/common/util";
import CookieUtil from "extend/common/CookieUtil";
import RequestUtil from "extend/common/RequestUtil";
import InfoValidator from 'extend/validator/InfoValidator';
import WeixinUtil from "extend/common/WeixinUtil";
import HistoryUtil from "extend/common/HistoryUtil";
import RedirectUtil from "extend/common/RedirectUtil";
import Notification from 'components/Notification/Notification.jsx'
import 'scss/base.scss';
import 'scss/PhoneBind/index.scss';

class MyComponent extends Component {
	constructor (props) {
		super(props);
		this.state = {
			data: {
				phoneNum: "",
				verifyCode: "",
			},
			canSend: false,
			canBind: false,
			notification: {
				enter: false,
				message: "这里是提示信息"
			},
			secCount: -1,
			sendAlready: false,
		}
	}

	componentDidMount() {
		WeixinUtil.hideWeixinMenu();

		this.fixReturnDeadLoop();
	}

	/**
	 * [fixReturnDeadLoop 修复BindPhone页面的返回死循环]
	 * @Author   JohnNong
	 * @Email    overkazaf@gmail.com
	 * @Github   https://github.com/overkazaf
	 * @DateTime 2016-12-22T14:18:09+0800
	 * @return   {[type]}                     [description]
	 */
	fixReturnDeadLoop() {
		if (document.referrer !== '') {
			HistoryUtil.addHistoryBackListener(() => {
				RedirectUtil.redirectPage({
					pageName: 'HomePage',
					options: {},
				});
			});
		}
	}

	handleGetFoucus(targetRef, event) {
		this.refs[targetRef].focus();
	}

	updateMainInfoValue(areaData) {
		const { phoneNum, verifyCode } = this.refs;

		let data = Util.deepClone(this.state.data);
		data = {
			phoneNum: phoneNum.value,
			verifyCode: verifyCode.value,
		}

		this.setState({data}, ()=>{
			this.validateAndResetSumbitButton();
		});
	}

	validateAndResetSumbitButton() {
		let validPhone = this.validatePhoneForm(),
			validVerifyCode = this.validateVerifyCodeForm();
		let canSend = validPhone.success,
			canBind = canSend && validVerifyCode.success;
		this.setState({
			canSend,
			canBind,
		});
	}

	validatePhoneForm() {
		let {phoneNum} = this.state.data;

		let composePersonForm = function (info){
			let arr = [];
			// 依待校验的格式处理联系电话
			arr.push({
				currentValue: info,
				isRequired: true,
				validateRules: [
					{ "rule": "notNull","param":{}, "errorMessage": "手机号码不能为空", data: {"currentValue": info}},
					{ "rule": "isMobile","param":{}, "errorMessage": "手机号码格式非法", data: {"currentValue": info}}
				]
			});
			return arr;
		};
		let checkResult = InfoValidator.validInfoByFormatedForm(composePersonForm(phoneNum));
		return checkResult;
	}

	validateVerifyCodeForm() {
		let {verifyCode} = this.state.data;

		let composePersonForm = function (info){
			let arr = [];
			// 依待校验的格式处理验证码
			arr.push({
				currentValue: info,
				isRequired: true,
				validateRules: [
					{ "rule": "notNull","param":{}, "errorMessage": "验证码不能为空", data: {"currentValue": info}},
					{ "rule": "isVerifyCode","param":{}, "errorMessage": "验证码格式非法", data: {"currentValue": info}}
				]
			});
			return arr;
		};
		let checkResult = InfoValidator.validInfoByFormatedForm(composePersonForm(verifyCode));
		return checkResult;
	}

	handleSendText() {
		const that = this;
		let validPhoneResult = this.validatePhoneForm();
		let SendTextStrategy = {
			'success': function (result) {
				if(that.state.secCount != -1) return; 
				that.setState({
					canSend: false,
					secCount: 60
				}, ()=>{
					let countTimer = setInterval( ()=>{
						let secCount = that.state.secCount;
						secCount--;
						that.setState({secCount});
					}, 1000);
					setTimeout( () => {
						clearInterval(countTimer);
						countTimer = null;
						that.setState({secCount: -1});
						that.validateAndResetSumbitButton();
					}, (that.state.secCount + 1) * 1000);
				});
				
				
				let smsTpl = (Util.fetchValueByCurrentURL('YQQ') == 1) ? "XG01" : "YG03";

				let param = {
					//url : `http://sjyxtest.yiqiguang.com/user/sendRegSms/${smsTpl}/${that.state.data.phoneNum}`,
					url : `http://user.xinguang.com/sendRegSms/${smsTpl}/${that.state.data.phoneNum}`,
					method : 'GET',
					data: {
						// type: 'r',
						// clientCode: 'YG03',
					},
					successFn : function (data){
						if (data.code == 0) {
							that.enter("短信发送成功");
							that.setState({sendAlready: true});
						} else {
							that.enter("短信发送失败，请稍后再试...");
						}
					},
					errorFn : function () {
						that.enter("短信发送失败，请稍后再试...");
						console.error(arguments);
					}
				};
				RequestUtil.fetchInAbsoluteUrl(param);
			},
			'fail': function(result) {
				that.enter(result.message);
			}
		}
		SendTextStrategy[validPhoneResult.success ? 'success' : 'fail'].call(this, validPhoneResult);
	}

	handleBind() {
		const that = this;
		let validResult = this.validatePhoneForm();
		validResult.success && (validResult = this.validateVerifyCodeForm());

		let SendTextStrategy = {
			'success': function (result) {
				let param = {
					url : `oauth/bindUid`,
					method : 'POST',
					data: {
						token: CookieUtil.getCookie("token"),
						uid: that.state.data.phoneNum,
						verifyCode: that.state.data.verifyCode,
					},
					successFn : function (data){
						if (data.code == 0) {
							that.enter("验证成功");

							let pureUrl = Util.fetchParamValueByCurrentURL('redirect_url');
							let options = Util.cloneObjExceptParam(Util.parseQueryString(location.href), 'redirect_url');
							location.href = Util.getRedirectUrl(pureUrl, options);
						} else {
							that.enter(data.message);
						}
					},
					errorFn : function () {
						that.enter("验证失败，请稍后再试...");
						console.error(arguments);
					}
				};
				RequestUtil.fetch(param);
			},
			'fail': function(result) {
				let message = result.success ? '请先发送验证码' : result.message;
				that.enter(message);
			}
		}
		SendTextStrategy[validResult.success && that.state.sendAlready ? 'success' : 'fail'].call(this, validResult);
	}

	/**
	 * 提示组件Notification出现，3s后自动消失
	 * @return {[type]} [description]
	 */
	enter(message = "这里是提示信息") {
		this.setState({
			notification: {
				enter: true,
				message: message
			}
		});
		setTimeout(function () {
			this.leave()
		}.bind(this), 3000)
	}

	leave() {
		this.setState({
			notification: {
				enter: false,
				message: ""
			}
		});
	}

	render () {
		const that = this;
		let maxPhoneLength = 11,
			maxNameLength = 6;
		return (
			<div className="m-phonebind">
				<div className="m-fill-info">
					<div className="phone" onClick={that.handleGetFoucus.bind(that,"phoneNum")}>
						<div className="fill-phone">
							<label>手机号码</label>
							<input ref="phoneNum" className="phone-field" onChange={that.updateMainInfoValue.bind(that)} maxLength={maxPhoneLength}/>
						</div>
						<div className={"btn-send" + (that.state.canSend && (that.state.secCount == -1) ? " enabled" : "")} onClick={that.handleSendText.bind(that)}>
							<div className="border">
								获取验证码
								{that.state.secCount == -1 ? '' : `(${that.state.secCount})`}
							</div>
						</div>
					</div>
					<div className="code" onClick={that.handleGetFoucus.bind(that,"verifyCode")}>
						<label>验证码</label>
						<input ref="verifyCode" className="name-field" onChange={that.updateMainInfoValue.bind(that)} maxLength={maxNameLength}/>
					</div>
					<div className={"btn-bind" + (that.state.canBind ? " enabled" : "")} onClick={that.handleBind.bind(that)}>绑定</div>
				</div>
				<Notification enter={that.state.notification.enter} leave={that.leave.bind(that)}>{that.state.notification.message}</Notification>
			</div>
		)
	}
}


function doRender () {
	ReactDOM.render(<MyComponent /> , document.getElementById("app"));
}

setTimeout(doRender, 16);