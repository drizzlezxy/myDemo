import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import Util from "extend/common/util";
import RequestUtil from "extend/common/RequestUtil";
import RedirectUtil from "extend/common/RedirectUtil";
import WeixinUtil from "extend/common/WeixinUtil";
import Logger from "extend/common/Logger";
import CookieUtil from "extend/common/CookieUtil";

import YQSetCustom from "components/YQSetCustom/YQSetCustom";
import ShareModal from "components/ShareModal/ShareModal";
import WeixinShareDataDynamic from "data/WeixinShareDataDynamic";

import 'scss/base.scss';
import 'scss/YQSetGift/index.scss';
import 'scss/YQPaySuccess/index.scss';

class MyComponent extends Component {
	constructor (props) {
		super(props);
		this.state={
          	benediction:CookieUtil.getCookie("benediction"),
            "password":CookieUtil.getCookie("passWord").split(','),
        }
	}
	

	/**
	 * [GetShareInformation 设置分享信息]
	 */
	GetShareInformation(giftId,benediction) {
		let url = RedirectUtil.getPageUrlByPageName("YQGiftBox");//分享出去的抢页面的地址
		let userheader =CookieUtil.getCookie("headImg");
		let _nickName = CookieUtil.getCookie("nickName");

		let options = {
			nickName:_nickName,
			desc:benediction,
			link:url + "?giftId=" + giftId,
			imgUrl:userheader
		} 

		WeixinUtil.shareByPageOption(WeixinShareDataDynamic.getData('QingList',options));
	}

	
	/**
	 * [shareHandleClick 去分享操作]
	 * @param  {[type]} giftId      [description]
	 * @param  {[type]} benediction [description]
	 * @return {[type]}             [description]
	 */
	shareHandleClick() {
		let that = this;
		let paramObj    = Util.parseQueryString(location.href);
		let giftId      = paramObj.giftId;
		this.GetShareInformation(giftId,that.state.benediction);
		$('.m-share-modal').fadeIn('fast');
	}
	
	componentDidMount() {
		let that = this;
		let paramObj    = Util.parseQueryString(location.href);
		let giftId      = paramObj.giftId;
		this.GetShareInformation(giftId,that.state.benediction);
	}

	
    /**
	* 隐藏分享模态框
	**/
	hide() {
		$('.m-share-modal').fadeOut('fast');
	}

	render () {
		return (
			<div className="m-yqpaysuccess">
				<div className="m-body">
					<YQSetCustom benediction={this.state.benediction} disabled="disabled"></YQSetCustom>
					<div className="tip">快去分享给你的朋友吧~</div>
					{this.state.password[0] != "" ? 
					<div className="m-set-pwd">
						<div className="head">
							分享礼盒口令
						</div>
						
						<div className="m-pwd-input">
							<div className="item" >
								<input type="tel"  maxLength="1" disabled value={this.state.password[0]} ref="pwd1" />
							</div>
							<div className="item" >
								<input type="tel"  maxLength="1" disabled value={this.state.password[1]} ref="pwd2" />
							</div>
							<div className="item" >
								<input type="tel"  maxLength="1" disabled value={this.state.password[2]} ref="pwd3" />
							</div>
							<div className="item" >
								<input type="tel" maxLength="1"  disabled value={this.state.password[3]}  ref="pwd4" />
							</div>
						</div>
					</div>
					 : '' } 


				</div>
				<div className="m-footer">
					<div onClick={this.shareHandleClick.bind(this)} className="btn btn-share">
						去分享
					</div>
					<ShareModal hide={this.hide.bind(this)} />
				</div>
			</div>
		)
	}
}


function doRender () {
	ReactDOM.render(<MyComponent /> , document.getElementById("app"));
}

setTimeout(doRender, 16);