import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import Util from "extend/common/util";
import CookieUtil from "extend/common/CookieUtil";
import RequestUtil from "extend/common/RequestUtil";
import RedirectUtil from "extend/common/RedirectUtil";
import WeixinUtil from "extend/common/WeixinUtil";
import HistoryUtil from "extend/common/HistoryUtil";
import GroupMembers from "components/GroupMembers/GroupMembers";
import CountDown from 'components/CountDown/CountDown';
import PrdtFragment from "components/PrdtFragment/PrdtFragment";
import ShareModal from "components/ShareModal/ShareModal";
import 'scss/base.scss';
import 'scss/GroupStatus/index.scss';

import GroupStatus from "data/group/GroupStatus.json";

class MyComponent extends Component {
	constructor (props) {
		super(props);

		this.state = {
			groupStatus: GroupStatus.unLoded,	//-1: 未获取拼团信息 0: 拼团信息获取错误  1: 拼团中  2: 组团成功  3: 组团失败
			skuStatus: 0,	//0: 下架  1：在售
			groupNum: 0,
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
			groupMembersInfo: {	
				membersLimitNum: 0,
				membersAvatar: [],
			},
			errorMsg: '',
		}
	}

	componentDidMount () {
		const that = this;

		WeixinUtil.hideWeixinMenu();

		that.initPrdtInfo((data) => {
			that.initWXShare(data);
			that.initUserHeadImg(data);
		});

		HistoryUtil.addHistoryBackListener(() => {
			RedirectUtil.redirectPage({
				pageName: 'OrderList',
				options: {
					type: 0, 
				}
			});
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
				if (data.code == 0) {
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
						skuStatus: Number(result.skuStatus),
						groupNum: result.groupNum,
						prdtInfo,
						timeInfo: {
							startTime: startTime,
							durationTime,
						},
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
		let joinGroupLink = RedirectUtil.getPageUrlByPageName('JoinGroup');

		joinGroupLink = Util.appendParam4Url(joinGroupLink, 'poSkuId', this.state.prdtInfo.poSkuId);
		joinGroupLink = Util.appendParam4Url(joinGroupLink, 'groupId', Util.fetchParamValueByCurrentURL('groupId'));

		let opt = {
			title: `【还差${data.remainNum}人】${Number(data.salePrice).toFixed(2)}元 ${data.itemName}`,
			link: joinGroupLink,
			imgUrl: data.itemUrl,
			desc: data.itemDescrption,
			success: function () {
			},
			cancel: function () {
			},
		};

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

	handleClick() {
		$('.m-share-modal').fadeIn('fast');
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
			groupStatus,
			skuStatus,
			groupMembersInfo,
			prdtInfo,
			timeInfo,
		} = this.state;

		return (
			<div className="m-group-status">
				<PrdtFragment info={prdtInfo} groupStatus={groupStatus}/>
				<GroupMembers info={groupMembersInfo} groupStatus={groupStatus}>
					<CountDown timeInfo={timeInfo} />
				</GroupMembers>
				<div className="m-btn-more" onClick={this.handleClick.bind(this)}>
					<div>邀请好友来参团</div>
				</div>
				<ShareModal hide={this.hide.bind(this)} />
			</div>
		)
	}
}


function doRender () {
	ReactDOM.render(<MyComponent /> , document.getElementById("app"));
}

setTimeout(doRender, 16);