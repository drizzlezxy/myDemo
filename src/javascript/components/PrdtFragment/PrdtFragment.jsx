import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import Util from "extend/common/util";
import 'scss/base.scss';
import './PrdtFragment.scss';

export default class RouteItem extends Component {
	constructor (props) {
		super(props);
        
		this.state = {
			groupStatus: this.props.groupStatus,
			prdtInfo: this.props.info || {
				imgUrl: "",
				title: "",
				spec: "",
				price: 0,
				skuPrice: 0,
				itemId: 0,
				skuId: 0,
				poSkuId: 0,
			},
		};
	}


    componentWillReceiveProps (nextProps) {
        if (nextProps) {
        	let state = {};
        	!!nextProps.info && (state.prdtInfo = nextProps.info);
        	!!nextProps.groupStatus && (state.groupStatus = nextProps.groupStatus);
            this.setState(state);
        }
    }

    componentDidMount () {
	}

	getStatusDivByStatus (statusCode = this.state.groupStatus) {
		statusCode = Number(statusCode);
		let clazz = "item-status ";
		switch(statusCode) {
			case 1:
				clazz += "group-during";
				break;
			case 2:
				clazz += "group-success";
				break;
			case 3:
				clazz += "group-fail";
				break;
			case 0:
			default:
				clazz += "";
				break;
		}

		return <div className={clazz}></div>;
	}

	render () {
		let {
			imgUrl,
			title,
			spec,
			price,
			skuPrice,
			itemId,
			skuId,
			poSkuId,
		} = this.state.prdtInfo;

		let priceArr = Util.priceFormat(price);
		let skuPriceArr = Util.priceFormat(skuPrice);
		
		let statusDiv = this.getStatusDivByStatus();
		
		let itemImageStyleObj = {
				backgroundImage: 'url('+ imgUrl +')',
			};

		let itemHref = Util.isGroupBuy() ? 
					   `../GroupItemDetail/index.html?poSkuId=${poSkuId}` :
					   `../ItemDetail/index.html?prdtId=${itemId}`;

		return (
			<a className="m-prdt-fragment" href={itemHref}>
				<div className="prdt-img" style={itemImageStyleObj}></div>
				<div className="prdt-detail">
					<div className="title">{title}</div>
					<div className="spec">{spec}</div>
					<div className="price">￥<span className="big-size">{priceArr[0]}</span>{priceArr[1]} <span className="sku-price">￥{skuPriceArr[0] + skuPriceArr[1]}</span></div>
				</div>
				{statusDiv}
			</a>
		)
	}
}