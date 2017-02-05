let state = {
	isOldOrder: false,
	address: {
		// addressId: 123,
		// name: '陆小凤',
		// tel: '18623221222',
		// phone: '010-2322123',
		// addressString: '浙江省杭州市近江时代大厦A座12楼 优秀的饮水机旁边',
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
		checked: false,
		type: 1,
		invoiceTitle: '',
		types: [
			{
				id: 0,
				name: '占位',
				value: 0,
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
	shopList: [
		// {
		// 	shopId: 1,
		// 	shopName: '店铺一',
		// 	count: 1,
		// 	deliveryTypes: [
		// 		{
		// 			id: 2,
		// 			name: 'self',
		// 			label: '自提',
		// 			value: 2,
		// 			isActive: false,
		// 		},
		// 		{
		// 			id: 1,
		// 			name: 'express',
		// 			label: '快递',
		// 			value: 1,
		// 			isActive: true,
		// 		}
		// 	],
		// 	deliveryInfo: {
		// 		selected: 0, 
		// 		deliveryAddressList: [
		// 		],
		// 	},
		// 	itemList: [
		// 	],
		// 	totalPrice: 1,
		// 	postage: 0.00,
		// }
	],
	currentDeliveryType: 1,
	protocol: {
		checked: true,
	},
	totalPrice: 0.00,
	postage: 0.00,
	payEnabled: true,
};

export default state;