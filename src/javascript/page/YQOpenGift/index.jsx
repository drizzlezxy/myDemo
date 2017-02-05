import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import Util from "extend/common/util";
import RequestUtil from "extend/common/RequestUtil";
import WeixinUtil from "extend/common/WeixinUtil";
import Logger from "extend/common/Logger";
import CookieUtil from "extend/common/CookieUtil";
import LoginUtil from "extend/login/loginUtil";

import YQGiftSku from "components/YQGiftSku/YQGiftSku";
import YQPhoneValidate from "components/YQPhoneValidate/YQPhoneValidate";

import 'scss/base.scss';
import 'scss/YQOpenGift/index.scss';

class MyComponent extends Component {
	constructor (props) {
		super(props);

		this.state = {
			prdtDetail:{},
			phone:"",
			code:"",
			isBindMobile:false,
			giftHeadUrl:"",
			itemUrl:"",
		};
	}
	
	
	componentDidMount() {
		let that = this;
		WeixinUtil.hideWeixinMenu();
		LoginUtil.getUserInfo( (userMsg,result) => {
			that.GetUserBindMobile(userMsg,result);
		});
		this.initGiftDetail();
		
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
	
	/**
	 * [GetSkuProductList 根据礼盒Id 返回礼盒详细信息]
	 */
	initGiftDetail() {
		let that = this;
		
		let param = {
			url : 'gift/giftDetail',
			method : 'GET',
			data: {
				giftId: Util.fetchValueByCurrentURL('giftId'),
			},
			successFn : function (result) {
                if (RequestUtil.isResultSuccessful(result)) {
					let {poSkuSysVO, quantity, finishQuantity, status, giftHeadUrl} = result.result;
					
                	that.setState({
                		prdtDetail: poSkuSysVO,
                		giftHeadUrl:giftHeadUrl,
                		itemUrl:poSkuSysVO.itemUrl,
                	},() => {
						CookieUtil.setCookie("Q_SKUNAME",poSkuSysVO.skuName,30*24*60*60, '/', window.location.hostname);
                	});

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
	
	GetUserBindMobile(userMsg,resultCode) {
		let that = this;
		let flag = true;
		const {gotError, gotInfoWrong, gotNotBinded, gotInfo} = LoginUtil.loginResultStatus;
		if(resultCode == gotNotBinded) {
			// 未绑定手机号
			flag = false;
		}

		that.setState({
			isBindMobile:flag
		});
	}

	render () {
		

		return (
			<div className="m-yqopengift">
				<div className="m-body">
					<YQGiftSku prdtDetail= {this.state.prdtDetail} />
				</div>
				<div className="m-footer">
					<YQPhoneValidate isBindMobile={this.state.isBindMobile} itemUrl= {this.state.itemUrl}></YQPhoneValidate>
				</div>
			</div>
		)
	}
}


function doRender () {
	ReactDOM.render(<MyComponent /> , document.getElementById("app"));
}

setTimeout(doRender, 16);