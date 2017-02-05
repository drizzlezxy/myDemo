import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import Util from "extend/common/util";
import RequestUtil from "extend/common/RequestUtil";
import WeixinUtil from "extend/common/WeixinUtil";
import RedirectUtil from "extend/common/RedirectUtil";
import LoginUtil from "extend/login/loginUtil";
import Logger from "extend/common/Logger";
// import ItemDetailTopBar from "components/ItemDetail/ItemDetailTopBar";
// import ItemDetailHeader from "components/ItemDetail/ItemDetailHeader";
// import ItemInfo from "components/ItemDetail/ItemInfo";

import JoinGroupHeader from "components/JoinGroup/JoinGroupHeader";
import GroupItemDetailBody from "components/GroupItemDetail/GroupItemDetailBody";
import GroupItemDetailFooter from "components/GroupItemDetail/GroupItemDetailFooter";
import ShareModal from "components/ShareModal/ShareModal";
import Notification from 'components/Notification/Notification.jsx'

import OpenGroupList from "components/OpenGroupList/OpenGroupList";
import 'scss/base.scss';
import 'scss/JoinGroup/index.scss';
// import GroupItemDetailState from 'states/GroupItemDetailState';

import GroupStatus from "data/group/GroupStatus.json";

class MyComponent extends Component {
	constructor (props) {
		super(props);

		this.initAuth();

		this.state = {
			prdtInfo: {
				imgUrl: "",
				title: "",
				spec: "",
				price: 0,
				skuPrice: 0,
				itemId: 0,
				skuId: 0,
				poSkuId: 0,
			},
			groupStatus: -1,	//-1: 未获取拼团信息 0: 拼团信息获取错误  1: 拼团中  2: 组团成功  3: 组团失败
			groupNum: 0,
			endTime: 0,
			groupMembersInfo: {	
				membersLimitNum: 0,
				membersAvatar: [],
			},
			detailList: [],
			enter: false,  //提示信息显示
			message: "",  //提示信息显示内容
			phoneBinded: true,
		}
	}

	initAuth() {
		let that = this;
		let appInfo = {
			env: 'WX',
		};

		let extraParam = {
			pageId: 'JoinGroup',
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
				break;

			case gotNotBinded:
				this.setState({phoneBinded: false});
				// LoginUtil.toBindPhone();
				break;

			case gotInfo:
				// this.joinGroup();
				// this.setUserInfo(userMsg);
				break;

			default:
				break;
		}
	}

	componentDidMount() {
		const that = this;

		WeixinUtil.hideWeixinMenu();

		that.initPrdtInfo((data) => {
			that.initWXShare(data);
			that.initUserHeadImg(data);
			that.initDetailList(data);
		});
	}

	initPrdtInfo(callback) {
		const that = this;
		let param = {
			url : `group/recordcontent`,
			method : 'GET',
			data: {
				groupId: Util.fetchParamValueByCurrentURL('groupId'),
			},
			successFn : (data) => {
				if (RequestUtil.isResultSuccessful(data)) {
					let result = data.result;

					let prdtInfoHook = function(data) {
						return {
							imgUrl: data.itemUrl,
							title: (data.brandName || '') + ' ' + data.itemName + data.specification,
							spec: data.itemDescrption,
							price: data.salePrice,
							skuPrice: data.skuSalePrice,
							itemId: data.itemId,
							skuId: data.skuId,
							poSkuId: data.poSkuId,
						}
					};

					let prdtInfo = prdtInfoHook(result);

					let {startTime, endTime} = result;
					let durationTime = result.endTime - result.startTime;

					this.setState({
						groupStatus: Number(result.status),
						groupNum: result.groupNum,
						timeInfo: {
							startTime: startTime,
							durationTime,
						},
						prdtInfo,
					}, callback.bind(that, result));

				} else {
					that.setState({
						groupStatus: 0,
						errorMsg: data.message,
					});
					console.error(data.message);
				}
			},
			errorFn : (data) => {
				that.setState({ groupStatus: 0 });
				console.error(arguments);
			}
		};
		RequestUtil.fetch(param);
	}

	initWXShare(data) {
		let opt = {
			title: `【还差${data.remainNum}人】￥${Number(data.salePrice).toFixed(2)} ${data.itemName}`,
			link: location.href,
			imgUrl: data.itemUrl,
			desc: data.itemDescrption,
			success: function () {
			},
			cancel: function () {
			},
		}
		WeixinUtil.shareByPageOption(opt);

		WeixinUtil.showWeixinMenu();
	}

	initUserHeadImg(PrdtData) {
		const that = this;
		let param = {
			url: 'group/usercontent',
			method: 'GET',
			data: {
				groupId: Util.fetchParamValueByCurrentURL('groupId'),
			},
			successFn: (data) => {
				if(data.code == 0){
					let result = data.result;

					let groupMembersInfoHook = function(data, limitNum) {
						return {
							membersLimitNum: limitNum || 0,
							membersAvatar: data.map( item => item.imgUrl),
						}
					};

					let groupMembersInfo = groupMembersInfoHook(result, PrdtData.groupNum);

					this.setState({
						groupMembersInfo,
					});
				} else {
					console.error(data.message);
				}
			},
			errorFn: (data) => {
				console.error(arguments);
			}
		}
		RequestUtil.fetch(param);
	}

	initDetailList(data) {
		const that = this;
		let param = {
			url: 'posku/content',
			method: 'GET',
			data: {
				poSkuId: data.poSkuId,
			},
			successFn: (result) => {
				if(RequestUtil.isResultSuccessful(result)) {
					that.setState({
						detailList: result.result.detailList,
					})
				}
			},
			errorFn: () => {
				console.error(arguments);
			},
		}
		RequestUtil.fetch(param);
	}

	handleClick(clickType) {
		switch(clickType) {
			case 'share':
				$('.m-share-modal').fadeIn('fast');
				// Logger.log('share');
				break;
			case 'join':
				this.joinGroup();
				// Logger.log('join');
				break;
		}
	}

	joinGroup() {
		const that = this;

		let param = {
			url: 'posku/check',
			method: 'GET',
			data: {
				groupId: Util.fetchParamValueByCurrentURL('groupId'),
				poSkuId: that.state.prdtInfo.poSkuId,
				userId: Util.fetchUserId(),
				uid: Util.fetchUid(),
			},
			successFn: (result) => {
				if(RequestUtil.isResultSuccessful(result)) {
					let redirectParam = {
						pageName: 'ConfirmOrder',
						options: {
							poSkuId: that.state.prdtInfo.poSkuId,
							skuId: that.state.prdtInfo.skuId,
							groupId: Util.fetchParamValueByCurrentURL('groupId'),
						},
					}

					if(that.state.phoneBinded) {
						RedirectUtil.redirectPage(redirectParam);
					} else {
						LoginUtil.toBindPhone(redirectParam);
					}
				} else {
					that.enter(result.message);
				}
			},
			errorFn: () => {
				that.enter('网络错误');
				console.error(arguments);
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
	enter(message) {
		this.setState({
			enter: true,
			message: message,
		});
		setTimeout(function () {
			this.leave()
		}.bind(this), 2000)
	}

	/**
	* 隐藏分享模态框
	**/
	hide() {
		$('.m-share-modal').fadeOut('fast');
	}

	showPage() {
		//仅显示空白，除非团在进行中
		
		let groupStatus = this.state.groupStatus;

		if(groupStatus == GroupStatus.waiting) {
			return true;

		} else if(groupStatus == GroupStatus.success || groupStatus == GroupStatus.fail) {
			location.href = '../GroupStatus/index.html?groupId=' + Util.fetchParamValueByCurrentURL('groupId');
			return false;

		} else {
			return false;
		}
	}

	render () {
		if(!this.showPage()) {
			return <div></div>
		}		

		let {
			prdtInfo,
			groupStatus,
			timeInfo,
			groupNum,
			detailList,
			groupMembersInfo,
		} = this.state;

		return (
			<div className="m-joingroup">
				<div className="m-header">

					<JoinGroupHeader
					 	prdtInfo={prdtInfo}
					 	timeInfo={timeInfo}
					 	groupNum={groupNum}
					 	groupStatus={groupStatus} 
					 	groupMembersInfo={groupMembersInfo}/>

				</div>
				<div className="m-body">
					<GroupItemDetailBody 
						detailList={detailList}
					/>
				</div>
				<div className="m-footer">
					<div onClick={this.handleClick.bind(this, 'share')} className="share">
						<i className="share-icon"></i>
						分享
					</div>
					<div onClick={this.handleClick.bind(this, 'join')} className="join">
						我要参团
					</div>
				</div>
				<ShareModal hide={this.hide.bind(this)} />
         		<Notification enter={this.state.enter} leave={this.leave.bind(this)}>{this.state.message}</Notification>
			</div>
		)
	}
}


function doRender () {
	ReactDOM.render(<MyComponent /> , document.getElementById("app"));
}

setTimeout(doRender, 16);