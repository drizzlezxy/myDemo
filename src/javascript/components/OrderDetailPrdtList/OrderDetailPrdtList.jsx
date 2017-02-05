import React, {Component} from 'react';
import Util from 'extend/common/util';
import RequestUtil from 'extend/common/RequestUtil';
import './OrderDetailPrdtList.scss';
import CONSTANTS from 'extend/constants/constants.json';

export default class OrderDetailPrdtList extends Component {
	constructor(props) {
	  super(props);
	
	  this.state = {
	  	prdtList: [],
		logisticsType: 0,
		promotionType: 0,
		orderStatus: 0,
		shopName: '',
	  };
	}

	buildHeaderInfo(shopName, orderStatus, logisticsType, promotionType) {
		let orderStatusText = [
				'',
				'待支付',
				'已支付',
				'待发货',
				'已发货',
				'已收货',
				'交易成功',
				'已取消',
				'已关闭',
				'申请退款，处理中',
				'退款成功，交易关闭',
			];

		let text = orderStatusText[orderStatus];

		// 修正团订单的文案显示
		if (orderStatus == 2) {
			if (promotionType == 0) {
				text = '待发货';
			}else if(promotionType == 3) {
				text = '一起请';
			} else {
				text = '拼团进行中';
			}
		}

		return (
			<div className="u-order-header clearfix">
				<span className="shop-name">{shopName}</span>
				<span className="status">{text}</span>
			</div>
		)
	}

	componentWillReceiveProps(nextProps) {
		if (Util.isExisty(nextProps.logisticsType)) {
			let {
				prdtList,
				logisticsType,
				orderStatus,
				promotionType,
				shopName,
			} = nextProps;

			this.setState({
				prdtList,
				logisticsType,
				orderStatus,
				promotionType,
				shopName,
			});
		}
	}

	handleClick({prdtId, orderId}) {
		let that = this;

		// 如果是团订单
		if(this.state.promotionType == 2) {

			that.getGroupDetail(orderId, (result) => {
				location.href = '../GroupItemDetail/index.html?poSkuId=' + result.poSkuId;
			});
			return;
		}

		location.href = '../ItemDetail/index.html?prdtId=' + prdtId;
	}

	getGroupDetail(orderId, callback) {
	    let param = {
	      url: 'posku/getPoOrder',
	      method: 'post',
	      data: {
	        userId: Util.fetchUserId(),
	        orderId,
	      },
	      successFn: (data) => {
	        if (RequestUtil.isResultSuccessful(data)) {
	          callback && callback(data.result);
	        } else {
	           Logger.error(data);
	        }
	      },
	      errorFn: (...args) => {
	        alert(CONSTANTS.MSG.NETWORK.NETWORK_EXCEPTION);
	      },
	    };

	    RequestUtil.fetch(param);

	}

	render() {
		let {
			prdtList,
			logisticsType,
			orderStatus,
			shopName,
			promotionType,
		} = this.state;

		let prdtListContents = prdtList.map((prdt, index) => {
			let {
				id,
				prdtId,
				image,
				name,
				spec,
				price,
				count,
				brandName,
			} = prdt;

			let brandNameContent = brandName !== '' ? `【${brandName}】` : '';

			return (
				<div
					key={`order-${index}`} 
					className="m-prdt-item"
					onClick={this.handleClick.bind(this, {prdtId, orderId: id})}>
		          	<img src={image} />
		          <div className="detail">
		            <div className="detail-name">
		              <div>{brandNameContent}{name}</div>
		              <div>{spec}</div>
		            </div>
		            <div className="detail-spec">
		              <div>x {count}</div>
		              <div>￥{price}</div>
		            </div>
		          </div>
				</div>
			)
		});

		let headerInfo = this.buildHeaderInfo(shopName, orderStatus, logisticsType, promotionType);

		return (
			<div className="m-prdtlist">
				{headerInfo}
				{prdtListContents}
			</div>
		)
	}
}