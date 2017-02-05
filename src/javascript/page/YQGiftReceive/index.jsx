import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import Util from "extend/common/util";
import RequestUtil from "extend/common/RequestUtil";
import RedirectUtil from "extend/common/RedirectUtil";
import WeixinUtil from "extend/common/WeixinUtil";
import LoginUtil from "extend/login/loginUtil";
import Logger from "extend/common/Logger";

import YQMyselfGift from "components/YQMyGift/YQMyselfGift";
import YQBottomBar from "components/YQBottomBar/YQBottomBar";
import YQNoGift from "components/YQNoGift/YQNoGift";
import Notification from 'components/Notification/Notification';
import BaseList from 'components/BaseList/BaseList';

import 'scss/base.scss';
import 'scss/YQGiftReceive/index.scss';

class MyComponent extends Component {
	constructor (props) {
		super(props);

		this.state = {
			giftItemList:[],
			limit: 10,
			offset: 0,
			enter: false,  //提示信息显示
			message: null,  //提示信息显示内容
			nodata:true,/*表示有数据*/
		};

		this.initLogin();
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
				// this.getUserInfo(userMsg);
				this.GetGiftList();
				break;

			default:
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


	
	/**
	 * [GetGiftList 获取我收到的红包列表]
	 */
	GetGiftList() {
		let that = this;
		let {limit, offset} = that.state;

		let param = {
			url: 'gift/pulllist',
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
                	});
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
	
	componentDidMount() {
		//this.GetGiftList();
		WeixinUtil.hideWeixinMenu();
	}
	
	render () {
		let that = this;
		console.log(that.state.giftItemList.length,"length");
		return (
			<div>
				
					<div className="m-yqgiftreceive">
						{that.state.nodata ? 
							<div className="m-body">
								<BaseList items={this.state.giftItemList} clazz="m-foretaste-list" 
									loadMore={this.loadMore.bind(this)}
									hasMore={this.state.hasMore} enter={this.enter.bind(this)}
								>
									<YQMyselfGift  />
								</BaseList>

							</div>
							:
							<YQNoGift show={this.state.nodata}  datatype="2" tip="您还没有收到礼盒哦!" btntext="我的请客单" />
						}
						{that.state.nodata ? 
							<div className="m-footer">
								<YQBottomBar activeIndex='1' buttonName="我的请客单"/>
							</div>
							: ""
						}
						
					</div>
					
				<Notification enter={this.state.enter} leave={this.leave.bind(this)}>{this.state.message}</Notification>
			</div>
		)
	}
}


function doRender () {
	ReactDOM.render(<MyComponent /> , document.getElementById("app"));
}

setTimeout(doRender, 16);