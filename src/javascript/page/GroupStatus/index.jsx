import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import Util from "extend/common/util";
import CookieUtil from "extend/common/CookieUtil";
import RequestUtil from "extend/common/RequestUtil";
import WeixinUtil from "extend/common/WeixinUtil";
import HistoryUtil from "extend/common/HistoryUtil";
import RedirectUtil from "extend/common/RedirectUtil";
import GroupMembers from "components/GroupMembers/GroupMembers";
import PrdtFragment from "components/PrdtFragment/PrdtFragment";
import 'scss/base.scss';
import 'scss/GroupStatus/index.scss';

class MyComponent extends Component {
	constructor (props) {
		super(props);

		this.state = {
			groupStatus: -1,	//-1: 未获取拼团信息 0: 拼团信息获取错误  1: 拼团中  2: 组团成功  3: 组团失败
			poSkuStatus: 0,	// 1:未开始 2:已结束 3:进行中 4:已售罄 5:已下架
			groupNum: 0,
			prdtInfo: {
				imgUrl: "",
				title: "",
				spec: "",
				price: 0,
				skuPrice: 0,
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
		WeixinUtil.hideWeixinMenu();

		let that = this;
		that.initPrdtInfo((data) => {
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


					this.setState({
						groupStatus: Number(result.status),
						poSkuStatus: Number(result.poSkuStatus),
						groupNum: result.groupNum,
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

	render () {
		if(this.state.groupStatus == -1) {
			//未获取数据前不显示任何元素
			return <div></div>
		} else if(this.state.groupStatus == 0) {
			return <div style={{textAlign: "center", lineHeight: "2rem"}}>{ this.state.errorMsg || '获取数据错误，请稍后再试。'}</div>
		}
		let {
			groupStatus,
			poSkuStatus,
			groupMembersInfo,
			prdtInfo
		} = this.state;

		let btnText = "去发现更多美味",
			btnHref = "../GroupSkuDetail/index.html";
		if(groupStatus == 3 && poSkuStatus == 3) {
			//组团失败,且sku有效时
			btnText = "我要开个团";
			btnHref = "../GroupItemDetail/index.html?poSkuId=" + this.state.prdtInfo.poSkuId;
		}

		return (
			<div className="m-group-status">
				<PrdtFragment info={prdtInfo} groupStatus={groupStatus}/>
				<GroupMembers info={groupMembersInfo} groupStatus={groupStatus}/>
				<a href={btnHref} className="m-btn-more">
					<div>{btnText}</div>
				</a>
			</div>
		)
	}
}


function doRender () {
	ReactDOM.render(<MyComponent /> , document.getElementById("app"));
}

setTimeout(doRender, 16);