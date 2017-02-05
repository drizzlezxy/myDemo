import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import Util from "extend/common/util";
import RequestUtil from "extend/common/RequestUtil";
import RedirectUtil from 'extend/common/RedirectUtil';
import WeixinUtil from "extend/common/WeixinUtil";
import ShareModal from "components/ShareModal/ShareModal";
import Logger from "extend/common/Logger";
import WeixinShareDataDynamic from "data/WeixinShareDataDynamic";
import Notification from 'components/Notification/Notification.jsx';
import 'scss/base.scss';
import 'scss/YQGetSuccess/index.scss';

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
			prdtDetail: {},
			enter: false,
			message: '',
		};
	}

	componentDidMount() {
		WeixinUtil.hideWeixinMenu();

		this.initGiftDetail((data) => {
			this.GetShareInformation(data);
		});
	}

	/**
	 * [GetShareInformation 设置分享信息]
	 */
	GetShareInformation(data) {
		// if((data.status != this.giftStatus.waiting) && (data.status != this.giftStatus.during)) {
		// 	return;
		// }
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
			},
			successFn : function (result) {
                if (RequestUtil.isResultSuccessful(result)) {
					let {poSkuSysVO, quantity, finishQuantity, status} = result.result;
                	
                	that.setState({
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

	handlePrdtClick() {}

	handleClick() {
		$('.m-share-modal').fadeIn('fast');
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

	getPrdtList() {
		let {itemUrl, skuName, skuDescription} = this.state.prdtDetail;
		let quantity = Util.fetchValueByCurrentURL('quantity');
		let prdtList = [];
		prdtList.push(
			<li className="detail-card" key="0"
				onClick={this.handlePrdtClick.bind(this)}
			>
				<div className="column">
					<img className="prdtImg" src={itemUrl} />
				</div>
				<div className="column detail">{skuName || ''}{skuDescription || ''}</div>
				<div className="column quantity"><span>{quantity || ''}</span>份</div>
			</li>
		)
		return prdtList;
	}

	render () {

		let prdtList = this.getPrdtList();
		return (
			<div className="m-yqgetsuccess">
				<ul className="gift-detail">
					{prdtList}
				</ul>
				<div className="txt-prdt-end"> 礼物已经向你飞奔啦 </div>
				<div className="official-accounts">
					<div className="QR-code"></div>
					<div className="text">想知道物流信息请扫这里哦</div>
				</div>
				<botton className="btn-share" onClick={this.handleClick.bind(this)}>
					快去把礼盒分享给其他小伙伴吧！
				</botton>
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