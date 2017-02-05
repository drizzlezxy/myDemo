import BaseAdaptor from './BaseAdaptor';
import DateUtil from 'extend/common/DateUtil';
import Util from 'extend/common/util';

export default class OrderAdaptor extends BaseAdaptor {

	constructor(data) {
		super(data);

		this.init();
	}

	preProcessData() {
		return this.data;
	}

	transform() {
		let prdtList = this.data;

		let newShopList = prdtList.map((shop) => {

			let {
				shopId,
				shopName,
				carriageFee,
				finalPrice,
				count,
				prdtList,
			} = shop;

			let totalCount = 0;
			let itemList = prdtList.map((item) => {

				let {
					id,
					skuId,
					prdtId,
					image,
					prdtName,
					brandName,
					price,
					spec,
					count,
					tagList,
					status,
					promotionSalePrice,
				} = item;

				console.log('item in ShopList adaptor', item);

				let displayedPrice = Util.isExisty(promotionSalePrice) ?
									 promotionSalePrice :
									 price;

				totalCount += parseInt(count, 10);
				return {
					prdtId,
					prdtName,
					brandName,
					count,
					spec,
					payPrice: displayedPrice,
					originPrice: displayedPrice, 
					status,
					addrInfo: null,
					imgUrl: image,
					addressNotSupported: false,
				};
			});

			return {
				shopId,
				shopName,
				count: totalCount,
				deliveryTypes: [
					{
						id: 2,
						name: 'self',
						label: '自提',
						value: 2,
						display: false,
						isActive: false,
					},
					{
						id: 1,
						name: 'express',
						label: '快递',
						value: 1,
						display: true,
						isActive: true,
					}
				],
				deliveryInfo: {
					selected: 0, 
					deliveryAddressList: [
					],
				},
				itemList,
				totalPrice: finalPrice,
				postage: carriageFee,
			};
		});


		return (this.data = newShopList);
	}

	postProcessData() {
		return this.data;
	}
}