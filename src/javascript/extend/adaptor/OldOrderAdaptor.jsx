import BaseAdaptor from './BaseAdaptor';
export default class OldOrderAdaptor extends BaseAdaptor {
	constructor(data) {
		super(data);

		this.init();
	}

	preProcessData() {
		return this.data;
	}

	transform() {
		let {
			orderId,
			status,
			statusStr,
			orderTime,
			shopId,
			shopName,
			businessId,
			payChannel,
			payChannelList,
			totalPrice,
			actionPrice,
			couponPrice,
			payPrice,
			freight,
			ownerInfoTitle,
			ownerInfoList,
			payResult,
			skuList,
			buttonList,
			isInvoice,
			invoiceType,
			invoiceTitle,
			expressNum,
			addressId,
			logisticsType,
		} = this.data;

		let counter = 0;
		let itemList = skuList.map((sku) => {
			let {
				id,
				prdtId,
				prdtImage,
				prdtName,
				spec,
				attributeList,
				price,
				count,
				tag,
				status,
				brandName,
				brandNameZH,
				buttonList,
				brandNameEN,
				image,
			} = sku;

			counter += count;

			return {
				addrInfo: '',
				addressNotSupported: false,
				count,
				spec,
				imgUrl: prdtImage,
				originPrice: price,
				payPrice: price*count,
				prdtId,
				prdtName,
				brandName: brandName || brandNameZH,
				status,
			};
		});

		let addressName = ownerInfoList[0] ? ownerInfoList[0].name : "";
		let addressTel = ownerInfoList[1] ? ownerInfoList[1].name : "";
		let addressString = ownerInfoList[2] ? ownerInfoList[2].name : "";


		let shopListInfo = {
			shopId: shopId,
			shopName: shopName,
			count: counter,
			deliveryTypes: [
				{
					id: 2,
					name: 'self',
					label: '自提',
					value: 2,
					display: false,
					isActive: logisticsType == 2,
				},
				{
					id: 1,
					name: 'express',
					label: '快递',
					value: 1,
					display: true,
					isActive: logisticsType == 1,
				}
			],
			deliveryInfo: {
				selected: 0, 
				deliveryAddressList: [
					{
						id: addressId,
						address: '',
						siteName: addressString,
					}
				],
			},
			itemList,
			totalPrice: totalPrice,
			postage: freight,
		};

		let newObj = {
			isOldOrder: true,
			address: {
				addressId: addressId,
				name: addressName,
				tel: addressTel,
				phone: '',
				addressString,
			},
			isSelfPickedListActive: false,
			payChanel: {
				selected: 0,
				channels: [
					{
						id: 1,
						name: 'wxPay',
						label: '微信支付',
						value: '2',
						display: true,
					},
					{
						id: 2,
						name: 'aliPay',
						label: '支付宝支付',
						value: '1',
						display: false,
					},
					{
						id: 3,
						name: 'unionPay',
						label: '银联支付',
						value: '3',
						display: false,
					}
				]
			},
			enter: false,
			message: '',
			invoice: {
				checked: isInvoice != 0,
				type: invoiceType,
				invoiceTitle: invoiceTitle,
				types: [
					{
						id: 0,
						name: 'placeHolder',
						label: '占位',
						display: false,
					},
					{
						id: 1,
						name: 'pensonal',
						label: '个人',
						value: 1,
						display: true,
					},
					{
						id: 2,
						name: 'company',
						label: '公司',
						value: 2,
						display: true,
					},
				]
			},
			shopList: [shopListInfo],
			currentDeliveryType: logisticsType,
			protocol: {
				checked: true,
			},
			totalPrice: payPrice,
			postage: freight,
			payEnabled: true,
		};

		return (this.data = newObj);
	}

	postProcessData() {
		return this.data;
	}
}