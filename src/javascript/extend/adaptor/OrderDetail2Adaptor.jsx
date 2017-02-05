import BaseAdaptor from './BaseAdaptor';
import Util from 'extend/common/util';
import DateUtil from 'extend/common/DateUtil';

export default class OrderDetail2Adaptor extends BaseAdaptor {

	constructor(data) {
		super(data);

		this.init();
	}

	preProcessData() {
		return this.data;
	}

	transform() {
		let order = this.data;

		let {
			ownerInfoList, 
			buttonList,
			skuList,
			status,
			logisticsType,
			promotionType,
			shopName,
		} = order;
		let deliveryInfoText = '暂无物流信息';
		let logisticsTypeText = (logisticsType == 1) ? '快递' : '自提';

		if (status > 3) {
			deliveryInfoText = '点击查看';
		}

		if (!Util.isExisty(ownerInfoList)) {
			ownerInfoList = [[], [], []];
		}

		let addressName = ownerInfoList[0] ? ownerInfoList[0].name : '';
		let addressTel = ownerInfoList[1] ? ownerInfoList[1].name : '';
		let addressStr = ownerInfoList[2] ? ownerInfoList[2].name : '';

		let addressInfo = [
			[
				{id:1, name: 'deliveryInfo', label: '物流信息', value: [deliveryInfoText], display: true,},
			],
			[
				{id:2, name: 'reciever', label: '收货人', value: [addressName], display: true,},
			],
			[
				{id:3, name: 'contactPhone', label: '联系电话', value: [addressTel], display: true,},
			],
			[
				{id:4, name: 'recvAddr', label: '收货地址', value: [addressStr], display: true,},
			]
		];
	
		let payInfo = [
			[
				{id:5, name: 'totalPrice', label: '商品总价', value: ['￥' + order.totalPrice], display: true,},
			],
			[
				{id:6, name: 'postage', label: '运费', value: ['￥' + order.freight], display: false,},
			],
			[
				{id:7, name: 'promotion', label: '促销优惠', value: ['￥' + order.couponPrice], display: true,},
			],
			[
				{id:8, name: 'invoice', label: '发票信息', value: [order.invoiceTitle == null ? '不需要发票' : order.invoiceTitle], display: true,},
			],
			[
				{id:9, name: 'payPrice', label: '实付', value: ['￥'+ order.payPrice, '(含邮费￥'+ order.freight +')'], display: true,},
			],
		];

		let orderStatus = status || 0;
		let prdtList = Util.isExisty(skuList) ? skuList.map((sku) => {
			return {
				id: order.orderId,
				prdtId: sku.prdtId,
				image: sku.prdtImage,
				name: sku.prdtName,
				spec: sku.spec,
				price: sku.price,
				count: sku.count,
				brandName: sku.brandNameZH,
			};
		}) : [];

		let deliveryInfo = [
			[
				{id:10, name: 'orderNo', label: '订单编号', value: [order.orderId], display: true,},
			],
			[
				{id:11, name: 'payMethod', label: '支付方式', value: ['微信支付'], display: true,}
			],
			[
				{id:12, name: 'delivery', label: '物流方式', value: [logisticsTypeText], display: true,}
			],
			[
				{id:13, name: 'commitTime', label: '下单时间', value: [DateUtil.formatDate(order.orderTime, 'yyyy-MM-dd HH:mm:ss')], display: true,},
			]
		];
		
		return (this.data = {
			addressInfo,
			payInfo,
			deliveryInfo,
			orderStatus: status,
			logisticsType,
			promotionType,
			shopName,
			prdtList,
		});
	}

	postProcessData() {
		return this.data;
	}
}