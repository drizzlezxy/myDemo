import BaseAdaptor from './BaseAdaptor';
import DateUtil from 'extend/common/DateUtil';

export default class OrderAdaptor extends BaseAdaptor {

	constructor(data) {
		super(data);

		this.init();
	}

	preProcessData() {
		return this.data;
	}

	transform() {
		let order = this.data;

		console.log('transform order', order);
		let couter = 0;
		let newOrders = order.skuList.map((item, index) => {
			couter += item.count;
			return {
				name: item.prdtName,
				spec: item.spec,
				price: item.price,
				image: item.prdtImage,
				brandNameEN: item.brandNameEN,
				brandName: item.brandName || item.brandNameZH,
				brandNameZH: item.brandNameZH,
				attributeList: item.attributeList,
				tag: item.tag,
				id: item.id,
				prdtId: item.prdtId,
				count: item.count,
				shopName: order.shopName,
				status: order.status,
				statusStr: order.statusStr,
				isGroup: order.promotionType == 2,
				groupOrderId: order.id,
			};
		});
		let newOrderObj = {
			id: order.id,
			shopId: order.shopId,
			businessId: order.businessId,
			buttonList: order.buttonList,
			expressNum: order.expressNum,
			shopName: order.shopName,
			orderTime: order.orderTime,
			orderStatus: order.status,
			orderStatusStr: order.statusStr,
			count: couter,
			skuSum: order.skuSum,
			submitDate: DateUtil.formatDate(order.orderTime, 'yyyy-MM-dd'),
			orders: newOrders,
			totalPrice: order.payPrice,
			isGroup: order.promotionType == 2,
			groupOrderId: order.id,
		};


		return (this.data = newOrderObj);
	}

	postProcessData() {
		return this.data;
	}
}