import React, { PropTypes } from 'react';
import './YQGiftSku.scss';
import Util from "extend/common/util";
import RequestUtil from "extend/common/RequestUtil";
import RedirectUtil from "extend/common/RedirectUtil";
import WeixinUtil from "extend/common/WeixinUtil";
import giftBox from "images/YQGift/icon_150@3x.png";


class YQGiftSku extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			//prdtDetail:this.props.prdtDetail,
		}

	}

	RedirectDeatail() {
		let __prdtDetail = this.props.prdtDetail;
		let poSkuId = __prdtDetail.poSkuId,
		prdtId= __prdtDetail.itemId,
		skuId = __prdtDetail.skuId;
		//let {poSkuId,prdtId,skuId} = {__prdtDetail.poSkuId,__prdtDetail.itemId, __prdtDetail.skuId};

		RedirectUtil.redirectPage({
			pageName: "ItemDetail",
			options: Object.assign({
				prdtId:prdtId,
			}, {}),
		});
	}

    render() {
        return (
        	<div className="m-qsku-list">
	        	<div className="tip">
					<img src={giftBox} alt="礼物红包" className="icon_gift"/><span>恭喜您抢到一个礼盒~</span>
	        	</div>
	        	<div className="m-product-list">
					<img src={this.props.prdtDetail.itemUrl} alt={this.props.prdtDetail.skuName}  />
					<div className="title">{this.props.prdtDetail.skuName}</div>
					<div className="alink_look" onClick={this.RedirectDeatail.bind(this)}>去看看</div>
	        	</div>
	      	</div>
        );
    }
}

export default YQGiftSku;