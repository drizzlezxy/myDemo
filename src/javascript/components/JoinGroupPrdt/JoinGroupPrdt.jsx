import React, {Component} from 'react';
import './JoinGroupPrdt.scss';

export default
class JoinGroupPrdt extends Component {

	constructor(props) {
	  super(props);
	
	  this.state = {};
	}

	render() {
		let {data} = this.props;

		let {
			image,
			name,
			desc,
			payPrice,
			originPrice,
		} = data;

		let payPriceFixed = Number(payPrice).toFixed(2);
		let originPriceFixed = Number(originPrice).toFixed(2);

		let payPriceSplits = payPriceFixed.split('.');
		let originPriceSplits = originPriceFixed.split('.');

		payPrice = payPriceSplits[0];
		let payFixed = payPriceSplits[1];
		
		originPrice = payPriceSplits[0];
		let originFixed = originPriceSplits[1];

		return (
			<div className="m-jg-prdt">
				<div className="prdt-img">
					<img src={image} />
				</div>
				<div className="prdt-detail">
					<div className="name">
						{name}
					</div>
					<div className="desc">
						{desc}
					</div>
					<div className="price">
						<span className="pay-price">
							￥
							<b>{payPrice}</b>
							.{payFixed}
						</span>
						<span className="origin-price">
							$
							<b>{originPrice}</b>
							.{originFixed}
						</span>
					</div>
				</div>
			</div>
		)
	}

}