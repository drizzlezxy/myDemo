import React, {Component} from 'react';
import Util from 'extend/common/util';
import './OrderShopList.scss';

export default
class OrderShopList extends Component {

	constructor(props) {
	  super(props);
	
	  this.state = {
	  	isOldOrder: props.isOldOrder,
	  	shopList: props.shopList,
	  	isPickedSelected: false,
	  };
	}

	handleDeliveryTypeChange(shopId, typeId) {
		if (this.state.isOldOrder) return;
		this.setState({
			isPickedSelected: (typeId === 2),
		}, () => {
			this.props.handleDeliveryTypeChange(shopId, typeId);
		});
	}

	componentWillReceiveProps(nextProps) {
		if (Util.isExisty(nextProps.shopList)) {
			this.setState({
				shopList: nextProps.shopList,
			});
		}

		if (Util.isExisty(nextProps.isOldOrder)) {
			this.setState({
				isOldOrder: nextProps.isOldOrder,
			});
		}
	}

	handlePickedDetailClick() {
		this.props.handlePickedDetailClick && this.props.handlePickedDetailClick();
	}

	render() {
		let that = this;
		let {
			shopList,
			isOldOrder,
			isPickedSelected,
		} = this.state;

		let shopContent = shopList.map((shop, index) => {
			let shopKey = `shop-${index}`;
			let {
				shopId,
				shopName,
				itemList,
				postage,
				totalPrice,
				deliveryTypes,
				deliveryInfo,
				count,
			} = shop;

			let itemListContent = itemList.map((item, index) => {
				let itemKey = `item-${index}`;
				let {
					prdtName,
					imgUrl,
					image,
					prdtImage,
					payPrice,
					count,
					brandName,
					spec,
					addressNotSupported,
				} = item;

				let addrExtraInfo = addressNotSupported ? '此地址暂不支持配送' : '';

				return (
					<div 
			          key={itemKey} 
			          className="m-order-card"
			        >
			          <img src={imgUrl}/>
			          <div className="detail">
			            <div className="detail-name">
			              <span>【{brandName}】{prdtName}</span>
			              <span>{spec}</span>
			            </div>
			            <div className="addr-extra">
			              <span>{addrExtraInfo}</span>
			            </div>
			            <div className="detail-spec">
			              <span>￥ {payPrice}</span>
			              <span>x {count}</span>
			            </div>
			            {/*cardDetail.status === 1 ? <div className="status">此地址暂不支持配送</div> : null*/}
			          </div>
			        </div>
				);
			});

			let deliveryTypesContent = deliveryTypes.map((m, index) => {
				let {
					id,
					isActive,
					label,
					value,
					display,
				} = m;

				let itemKey = `method-${index}`;
				let radioClazz = isActive ? 'radio active' : 'radio';
				let handleDeliveryTypeChange = () => {
					that.handleDeliveryTypeChange(shopId, id);
				};
				if (!display) {
					return (
						<span
							key={itemKey} 
						>
						</span>
					)
				}
				return (
					<span 
						onClick={handleDeliveryTypeChange}
						key={itemKey} 
						className="u-picked-method">
						<i 
						className={radioClazz}></i>
						<span className="label">{label}</span>
					</span>
				)
			});

			let deliveryAddress = deliveryInfo.deliveryAddressList.length > 0 ?
								  deliveryInfo.deliveryAddressList[deliveryInfo.selected].siteName :
								  '';

			let pickedDetailClazz = isPickedSelected ? 'detail' : 'hide';
			return (
				<div key={shopKey} className="u-shop">
					<div className="u-shop-header">
						<div className="pickedlist-info">
							{deliveryTypesContent}
							<div onClick={this.handlePickedDetailClick.bind(this)} className={pickedDetailClazz}>
								<div className="label">自提点</div>
								<div className="info">{deliveryAddress}</div>
							</div>
						</div>
					</div>
					<div className="u-shop-body">
						<div className="shop-name">
							<span className="icon-shop"></span>
							{shopName}
						</div>
						<div className="u-item-list">
							{itemListContent}
						</div>
						<div className="u-item-detail">
							<span>共{count}件商品</span>
							<span className="u-postage">
								运费：
								<b className="postage-price">
									￥
									<em>{postage}</em>
									<i></i>
								</b>
							</span>
							<span className="u-total">
								合计：
								<b className="total-price">
									￥
									<em>{totalPrice}</em>
									<i></i>
								</b>
							</span>
						</div>
					</div>
				</div>	
			)
		});


		return (
			<div className="m-ordershoplist">
				{shopContent}
			</div>
		)
	}
}