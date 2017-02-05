import React, { PropTypes } from 'react';
import './YQPhoneValidate.scss';
import Util from "extend/common/util";
import RequestUtil from "extend/common/RequestUtil";
import RedirectUtil from "extend/common/RedirectUtil";
import WeixinUtil from "extend/common/WeixinUtil";
import InfoValidator from "extend/validator/InfoValidator";
import Notification from 'components/Notification/Notification.jsx'
//import SendMobileCode from "components/SendMobileCode/SendMobileCode";
import CookieUtil from "extend/common/CookieUtil";

import UserDialog from "components/UserDialog/UserDialog";

class YQPhoneValidate extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			data: {
				phoneNum: "",
				verifyCode: "",
			},
			canSend: false,
			canNext: false,/*可以点击下一步操作*/
			notification: {
				enter: false,
				message: "这里是提示信息"
			},
			secCount: -1,
			sendAlready: false,
			showGift:false,
			dlgdata:{
				"ifSnatched":0,
				"giftIfSnatchDetail":{
					"skuId":0,
					"poSkuId":0,
					"giftId":0,
					"quantity":0,
				}
			},
		};
	}
	
	/**
	 * [updateMainInfoValue 手机号和验证码输入Change 修改值]
	 * @param  {[type]} areaData [description]
	 * @return {[type]}          [description]
	 */
	updateMainInfoValue(areaData) {
		const { phoneNum, verifyCode } = this.refs;

		let data = Util.deepClone(this.state.data);
		
		data = {
			phoneNum:Util.OnlyInt(phoneNum.value),
			verifyCode:Util.OnlyInt(verifyCode.value),
		}
		
		this.setState({
			data:data
		}, ()=>{
			this.validateAndResetSumbitButton();
		});
	}

	validateAndResetSumbitButton() {
		let validPhone = this.validatePhoneForm(),
			validVerifyCode = this.validateVerifyCodeForm();

		let canSend = validPhone.success,
			canNext = canSend && validVerifyCode.success;
		this.setState({
			canSend,
			canNext,
		});
	}
	
	/**
	 * [validateVerifyCodeForm 验证码格式验证]
	 * @return {[type]} [description]
	 */
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
	
	/**
	 * [validatePhoneForm 验证手机号码格式]
	 * @return {[type]} [description]
	 */
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

	/**
	 * [handleGetFoucus 点击获取焦点区域]
	 * @param  {[type]} targetRef [description]
	 * @param  {[type]} event     [description]
	 * @return {[type]}           [description]
	 */
	handleGetFoucus(targetRef, event) {
		this.refs[targetRef].focus();
		this.refs[targetRef].scrollIntoView()
	}
	
	/**
	 * [handleSendText 发送短信按钮且点击后倒计时文字变化]
	 * @return {[type]} [description]
	 */
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
				let param = {
					//url : `http://sjyxtest.yiqiguang.com/user/sendRegSms/XG01/${that.state.data.phoneNum}`,
					url : `http://user.xinguang.com/sendRegSms/XG01/${that.state.data.phoneNum}`,
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
	
	
	
	/**
	 * [handleOpen 发送完短信后点击进入下一步处理]
	 * @return {[type]} [description]
	 */
	handleOpen() {
		let that = this;
		
		let param = {
			url: 'gift/snatchGift',
			timeout:3000,
			method:'post',
			data: {
				giftId:  Util.fetchParamValueByCurrentURL("giftId"),
				userId:  Util.fetchUserId(),
				ctoken:  CookieUtil.getCookie("ctoken")
			},
			successFn: (data) => {
				if (RequestUtil.isResultSuccessful(data)) {
					// that.enter("验证成功");
					if(data.result.ifSnatched == 1) {
						that.showDialog(data.result);
					}else {
						// that.enter("抱歉，您没有抢到该礼物");
						 RedirectUtil.redirectPage({
							pageName: "YQGiftStatus",
							options: Object.assign({
								giftId:Util.fetchValueByCurrentURL('giftId'),
							}, {}),
						});

					}
					
				}else  if(data.code == 30040052 ){
					// Fix：已经过期礼盒,直接跳转至礼盒状态页面
					RedirectUtil.redirectPage({
						pageName: "YQGiftStatus",
						options: Object.assign({
							giftId:Util.fetchValueByCurrentURL('giftId'),
						}, {}),
					});

				}else if(data.code == 99902006 ) {
					// Fix：礼盒已经完成,跳转至状态页面
					RedirectUtil.redirectPage({
						pageName: "YQGiftStatus",
						options: Object.assign({
							giftId:Util.fetchValueByCurrentURL('giftId'),
						}, {}),
					});
				}else {
					 that.enter(data.message);
					
				}
			},
			errorFn: () => {
				that.enter("网络异常，请稍后再试");
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
	
	/**
	 * [showDialog 显示弹出层效果]
	 * @return {[type]} [description]
	 */
	showDialog(dlg_data) {
		let dlg =  dlg_data;// require("data/YQData/opengift.json").result;
		
		this.setState({
			showGift:true,
			dlgdata:dlg
		});
	}
	
	enter_dlg(message = "这里是提示信息") {
		this.setState({
			showGift:true,
		});
	}

	leave_dlg() {
		this.setState({
			showGift:false,
		});
	}

	/**
	 * [GetSkuProductList 根据礼盒Id 返回礼盒详细信息]
	 */
	GetGiftStatus(callback) {
		let that = this;
		
		let param = {
			url : 'gift/giftDetail',
			method : 'GET',
			data: {
				giftId: Util.fetchValueByCurrentURL('giftId'),
			},
			successFn : function (result) {
                if (RequestUtil.isResultSuccessful(result)) {
					let {status} = result.result;

					if(status == 4 ) {
						//FIXME: 红包已经过期
						that.enter("抱歉！红包已经过期");
					} /*else if (status == 3 ) {
						//FIX ME: 红包已经被抢光，但是还没有过期
						RedirectUtil.redirectPage({
							pageName: "YQGiftStatus",
							options: Object.assign({
								giftId:Util.fetchValueByCurrentURL('giftId'),
							}, {}),
						});
					}*/else {
						callback && callback();
					}

                }else{
					that.enter(result.message);
                }
			},
			errorFn : function () {
				that.enter("网络错误，请稍后再试");
			}
		};

		RequestUtil.fetchYQ(param);
	}
	
	RedirectAddr() {
		let that = this;

		RedirectUtil.redirectPage({
			pageName: "YQDeliveryAddr",
			options: Object.assign({
				funcType:"select",
				giftId:Util.fetchValueByCurrentURL('giftId'),
				redirect_url:RedirectUtil.getPageUrlByPageName("YQGetSuccess"),
				quantity:that.state.dlgdata.giftIfSnatchDetail.quantity,
			}, {}),
		});
	}
	/**
	 * [goFillAddr 点击填写地址,判断是否有过期-如果过期了提示用户礼盒已过期,如果没有过期，跳转到地址页面]
	 * @return {[type]} [description]
	 */
	goFillAddr() {
		let that = this;
		that.GetGiftStatus(that.RedirectAddr.bind(that));
		
	}

	handleBindMobile() {
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
							that.enter("手机绑定成功");
							that.handleOpen();
							
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

    render() {
    	
    	let that = this;
		let maxPhoneLength = 11,
			maxNameLength = 6;
			
        return (
        	<div className="m-phone-validate">
        		<div className="content">
					{this.props.isBindMobile == false ?
						<div>
							<div className="inputs phone" onClick={that.handleGetFoucus.bind(that,"phoneNum")} >
			        			<i className="icon_phone"></i><input type="tel" id="txt_phone" value={this.state.data.phoneNum} name="phone-field" ref="phoneNum" className="phone-field"  placeholder="赶紧输入手机号打开礼盒吧，否则就被抢走啦" maxLength={maxPhoneLength} onChange={that.updateMainInfoValue.bind(that)} />
				        	</div>
				        	<div className="inputs code" onClick={that.handleGetFoucus.bind(that,"verifyCode")} >
				        		<i className="icon_code"></i> <input type="tel" id="txt_code" value={this.state.data.verifyCode} name="txt_code" ref="verifyCode" className="name-field"  placeholder="输入验证码" onChange={that.updateMainInfoValue.bind(that)} maxLength={maxNameLength} />
								<div className={"btn-send" + (that.state.canSend && (that.state.secCount == -1) ? " enabled" : "")} onClick={that.handleSendText.bind(that)}>
									<div className="border">
										获取验证码
										{that.state.secCount == -1 ? '' : `(${that.state.secCount})`}
									</div>
								</div>
				        	</div>
			        	</div>
						:null
					}
		        	
		        	{this.props.isBindMobile == false ?
						<div className= {"btn_next" + (that.state.canNext ? " enabled" : "")}  onClick={that.handleBindMobile.bind(that)}>打开礼盒</div>
						:
						<div className= "btn_next enabled"  onClick={that.handleOpen.bind(that)}>打开礼盒</div>
		        	}
		        	
	        	</div>
	        	<Notification enter={that.state.notification.enter} leave={that.leave.bind(that)}>{that.state.notification.message}</Notification>

	        	<UserDialog enter={that.state.showGift} leave={that.leave_dlg.bind(that)} closeFlag="1" >
					<div className="m-dlgcustom-wrap">
						{   
							<div>
								<img src={this.props.itemUrl} alt={CookieUtil.getCookie("Q_SKUNAME")} />
								<p>恭喜您抢到<span className="red_num">{this.state.dlgdata.giftIfSnatchDetail.quantity}</span>份</p>
								<p className="title">{CookieUtil.getCookie("Q_SKUNAME")}</p>
								<div className="do">
									<button className="btn redirect_addr" onClick={that.goFillAddr.bind(that)}>去填写收货地址</button>
								</div>
							</div>
						}

					</div>
	        	</UserDialog>
	      	</div> 
        );
    }
}

export default YQPhoneValidate;