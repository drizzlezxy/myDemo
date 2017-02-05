import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import Util from "extend/common/util";
import RequestUtil from "extend/common/RequestUtil";
import RedirectUtil from "extend/common/RedirectUtil";
import WeixinUtil from "extend/common/WeixinUtil";
import LoginUtil from "extend/login/loginUtil";
import Logger from "extend/common/Logger";
import CookieUtil from "extend/common/CookieUtil";

import YQBottomBar from "components/YQBottomBar/YQBottomBar";
import BaseList from 'components/BaseList/BaseList';
import YQMyGift from "components/YQMyGift/YQMyGift";
import ShareModal from "components/ShareModal/ShareModal";
import WeixinShareDataDynamic from "data/WeixinShareDataDynamic";
import YQNoGift from "components/YQNoGift/YQNoGift";
import Notification from "components/Notification/Notification";
import 'scss/base.scss';
import 'scss/YQGift/index.scss';

class MyComponent extends Component {
	constructor (props) {
		super(props);

		this.state = {
			giftItemList:[],
			userMsg: {
				headImg: "",
				nickName: "",
				id:0
			},
			limit: 10,
			offset: 0,
			enter: false,  //提示信息显示
			message: null,  //提示信息显示内容
			nodata:true,/*表示有数据*/
		};
	}


	initLogin() {
		let that = this;
		let appInfo = {
			env: 'WX',
		};
		
		let extraParam = {
			pageId: 'YQGift',
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
				LoginUtil.toBindPhoneYQ();
				break;

			case gotInfo:
				this.getUserInfo(userMsg);
				this.GetGiftList();
				break;

			default:
				break;
		}
	}

	/**
	 * [getUserInfo 获取用户信息]
	 * @param  {[type]} userMsg [description]
	 * @return {[type]}         [description]
	 */
	getUserInfo(userMsg) {
		
		this.setState({
			userMsg: {
				headImg: userMsg.headImgUrl,
				nickName: userMsg.nickName,
				id:userMsg.id							
			}
		});

		CookieUtil.setCookie("headImg",userMsg.headImgUrl,30*24*60*60, '/', window.location.hostname);
		CookieUtil.setCookie("nickName",userMsg.nickName,30*24*60*60, '/', window.location.hostname);		
	}
	
	componentDidMount() {
		this.initLogin();
		WeixinUtil.hideWeixinMenu();
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
	 * [GetGiftList 获取我发起的请的红包列表]
	 */
	GetGiftList() {
		let that = this;
		let {limit, offset} = that.state;

		let param = {
			url: 'gift/pushlist',
			data: {
				"limit":limit,
				"offset":offset,
				"userId":Util.fetchUserId()
			},
			successFn: (data) => {
				if (RequestUtil.isResultSuccessful(data)) {
					let result = data.result;
					let o_items = Util.deepClone(that.state.giftItemList);
					let giftItemList = o_items.concat(result.data);
					
					that.setState({
                		giftItemList: giftItemList,
                		offset: offset + limit,
                		hasMore: result.totalCount > (offset + limit),
                		nodata:(giftItemList.length >0 ) ? true : false,
                	},);
				}else {
					that.enter(data.message);
				}
			},
			errorFn: () => {
				that.enter("网络异常，请稍后再试");
			},
		};

		RequestUtil.fetchYQ(param);
	}

	loadMore() {
		this.GetGiftList();
	}


	shareHandleClick(giftId,benediction) {
		this.GetShareInformation(giftId,benediction);
		$('.m-share-modal').fadeIn('fast');
	}
	
	/**
	 * [GetShareInformation 设置分享信息]
	 */
	GetShareInformation(giftId,benediction) {
		let url = RedirectUtil.getPageUrlByPageName("YQGiftBox");//分享出去的抢页面的地址
		let userheader = this.state.userMsg.headImg;
		let _nickName = this.state.userMsg.nickName;

		let options = {
			nickName:_nickName,
			desc:benediction,
			link:url + "?giftId=" + giftId,
			imgUrl:userheader
		} 
		
		WeixinUtil.shareByPageOption(WeixinShareDataDynamic.getData('QingList',options));
	}


    /**
	* 隐藏分享模态框
	**/
	hide() {
		$('.m-share-modal').fadeOut('fast');
		WeixinUtil.hideWeixinMenu();
	}
	

	
	render () {
		let that = this;
		let hasData;
		let userId = Util.fetchUserId();

		return (
			<div>
				{userId ? 
					<div>
						<div className="m-yqgift">
							{that.state.nodata ? 
								<div className="m-body">
									<BaseList items={this.state.giftItemList} clazz="m-foretaste-list" 
										loadMore={this.loadMore.bind(this)}
										hasMore={this.state.hasMore} nickName={this.state.nickName} headImg={this.state.headImg}
									>
										<YQMyGift shareHandleClick={this.shareHandleClick.bind(this)} />
						 			</BaseList>
						 			<ShareModal hide={this.hide.bind(this)} />
								</div>
								:
								<YQNoGift show={this.state.nodata} datatype="1" tip="您还没有请过别人哦!" btntext="我收到的礼盒" />
							}
							{that.state.nodata ? 
								<div className="m-footer">
									<YQBottomBar activeIndex='0' buttonName="我收到的礼盒"/>
								</div>
								:""
							}
							
						</div>
						
						<Notification enter={this.state.enter} leave={this.leave.bind(this)}>{this.state.message}</Notification>
					</div>:<div></div>
				}
			</div>
		)
		
	}
}


function doRender () {
	ReactDOM.render(<MyComponent /> , document.getElementById("app"));
}

setTimeout(doRender, 16);