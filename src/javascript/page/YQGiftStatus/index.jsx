import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import Util from "extend/common/util";
import RequestUtil from "extend/common/RequestUtil";
import RedirectUtil from 'extend/common/RedirectUtil';
import WeixinUtil from "extend/common/WeixinUtil";
import YQNoOneGot from "components/YQGiftStatus/YQNoOneGot";
import YQGiftStatus from "components/YQGiftStatus/YQGiftStatus";
import WeixinShareDataDynamic from "data/WeixinShareDataDynamic";
import ShareModal from "components/ShareModal/ShareModal";
import Notification from 'components/Notification/Notification.jsx';
import 'scss/base.scss';
import 'scss/YQGiftStatus/index.scss';

class MyComponent extends Component {
	constructor (props) {
		super(props);

		this.giftStatus = {
			waiting: 1, // 初始化
			during: 2, // 进行中
			ended: 3, // 已结束
			moneyBack: 4, //有退款
		}

		this.state = {
			isWaiting: true,
			giftDetail: {},
			prdtDetail: {},
		  	luckyList: [],
		  	listDetail:{
				limit: 10,
				offset: 0,
				hasMore: true,
			},
			enter: false,
			message: '',
		}
	}

	componentDidMount() {
		WeixinUtil.hideWeixinMenu();

		this.initGiftDetail((data) => {
			this.GetShareInformation(data);
		});
		setTimeout(
			() => {this.resetLuckyInfo()},
			200
		);
	}
	
	/**
	 * [GetShareInformation 设置分享信息]
	 */
	GetShareInformation(data) {
		if((data.status != this.giftStatus.waiting) && (data.status != this.giftStatus.during)) {
			return;
		}
		let {userName, benediction, giftId, giftHeadUrl} = data;
		let url = RedirectUtil.getPageUrlByPageName("YQGiftBox");//分享出去的抢页面的地址

		let options = {
			nickName: userName,
			desc: benediction,
			link: `${url}?giftId=${giftId}`,
			imgUrl: giftHeadUrl,
		} 

		WeixinUtil.shareByPageOption(WeixinShareDataDynamic.getData('QingList',options));
	}

	initGiftDetail(callback) {
		const that = this;

		let param = {
			url : 'gift/giftDetail',
			method : 'GET',
			data: {
				giftId: Util.fetchValueByCurrentURL('giftId'),
				userId: Util.fetchUserId(),
			},
			successFn : function (result) {
                if (RequestUtil.isResultSuccessful(result)) {
					let {poSkuSysVO, quantity, splitNum, finishSplitNum, status, onLinerVo} = result.result;
                	
                	that.setState({
                		isWaiting: false,
                		giftDetail: {
                			quantity,
                			splitNum,
                			finishSplitNum,
                			onLinerVo,
                			giftStatus: status,
                		},
                		prdtDetail: poSkuSysVO,
                	}, () => {
                		!!callback && callback(result.result);
                	});

                }else{
					that.enter(result.message);
                }
			},
			errorFn : function () {
				that.enter("网络错误，请稍后再试");
			}
		};
		return RequestUtil.fetchYQ(param);
	}

	resetLuckyInfo() {
		const that = this;

		let {limit, offset} = that.state.listDetail;
		let param = {
			url : 'gift/userDetails',
			method : 'GET',
			data: {
				giftId: Util.fetchValueByCurrentURL('giftId'),
				limit: limit,
				offset: offset,
			},
			successFn : function (result) {
                if (RequestUtil.isResultSuccessful(result)) {
                	let {data, totalCount} = result.result;
					let oldItems = Util.deepClone(that.state.luckyList);
					let items = oldItems.concat(data);

                	that.setState({
                		luckyList: items,
                		listDetail: {
	                		offset: offset + limit,
	                		hasMore: totalCount > (offset + limit),
	                		limit,
	                	}
                	});

                }else{
					that.enter(result.message);
                }
			},
			errorFn : function () {
				that.enter("网络错误，请稍后再试");
			}
		};
		return RequestUtil.fetchYQ(param);
	}

	loadMore() {
		this.resetLuckyInfo();
	}

	hide() {
		$('.m-share-modal').fadeOut('fast');
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

	render () {
		let {isWaiting, giftDetail, prdtDetail, luckyList, listDetail} = this.state;
		
		let isEmpty = !(giftDetail.finishSplitNum * 1) && (giftDetail.giftStatus == this.giftStatus.during);
		let content = !isWaiting ? 
			isEmpty ?
				<YQNoOneGot /> :
				<YQGiftStatus giftDetail={giftDetail} prdtDetail={prdtDetail}
					luckyList={luckyList} listDetail={listDetail} loadMore={this.loadMore.bind(this)}
				/> :
			<div></div>

		return (
			<div className="m-yqgiftstatus">
				{content}
				<ShareModal hide={this.hide.bind(this)}/>
				<Notification enter={this.state.enter} leave={this.leave.bind(this)}>{this.state.message}</Notification>
			</div>
		)
	}
}


function doRender () {
	ReactDOM.render(<MyComponent /> , document.getElementById("app"));
}

setTimeout(doRender, 16);