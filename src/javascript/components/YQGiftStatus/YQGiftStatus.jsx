import React, {Component} from 'react';
import RedirectUtil from 'extend/common/RedirectUtil';
import RequestUtil from "extend/common/RequestUtil";
import Util from "extend/common/util";
import BaseList from 'components/BaseList/BaseList';
import YQLuckyOne from 'components/YQGiftStatus/YQLuckyOne';
import './YQGiftStatus.scss';

export default
class YQGiftStatus extends Component {
	constructor(props) {
		super(props);

		this.giftStatus = {
			waiting: 1, // 初始化
			during: 2, // 进行中
			ended: 3, // 已结束
			moneyBack: 4, //有退款
		}
	}

	componentDidMount() {
	}

	handleShareClick() {
		$('.m-share-modal').fadeIn('fast');
	}

	handlePrdtClick() {
		this.props.prdtDetail.itemId && RedirectUtil.redirectPage({
			pageName: 'ItemDetail',
			options: {
				prdtId: this.props.prdtDetail.itemId,
			},
		})
	}

	getStatusIcon(remain) {
		let {waiting, during, ended, moneyBack} = this.giftStatus;
		let {giftStatus} = this.props.giftDetail;
		
		if(remain === 0) {
			return <div className="icon img-run-out"></div>
		}
		switch(giftStatus) {
			case waiting:
			case during:
				return <button className="btn-go-treat"
					onClick={this.handleShareClick.bind(this)}
				>继续发送</button>
				break;
			case ended:
			case moneyBack:
				return <div className="icon img-expired"></div>
			default:
				break;
		}

	}

	render() {
		let {luckyList, listDetail, loadMore, giftDetail, prdtDetail} = this.props;
		let {itemUrl, skuName, skuDescription} = prdtDetail;
		let {splitNum, finishSplitNum, quantity, onLinerVo} = giftDetail;
		let remain = splitNum - finishSplitNum;

		let statusIcon = this.getStatusIcon(remain);

		return (
			<div className="m-YQGiftStatus">
				<div className="gift-detail">
					<div className="detail-status">
						<div className="txt-remain">
							礼盒剩余 {remain === 0 ? '0' : (remain || '')}
							{(!remain ? '': ` / ${splitNum}`)} 份
						</div>
						{statusIcon}
					</div>
					{onLinerVo && (<div className="user-name">{onLinerVo.userName}抢到了：</div>)}
					<div className="detail-card"  onClick={this.handlePrdtClick.bind(this)}>
						<div className="column">
							<img className="prdtImg" src={itemUrl} />
						</div>
						<div className="column detail">{skuName || ''}{skuDescription || ''}</div>
						<div className="column quantity"><span>{(onLinerVo && onLinerVo.quantity) || quantity || ''}</span>份</div>
					</div>
					<i className="icon-triangle"></i>
				</div>

				<BaseList clazz="m-lucky-list" items={luckyList} 
					loadMore={loadMore}
					hasMore={listDetail.hasMore}
				>
					<YQLuckyOne />
	 			</BaseList>				
			</div>
		)
	}
}