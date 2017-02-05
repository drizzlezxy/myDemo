let state = {
	addressInfo: [
		[
			{id:1, name: 'deliveryInfo', label: '物流信息', value: ['', ''], display: true,},
		],
		[
			{id:2, name: 'reciever', label: '收货人', value: [''], display: true,},
		],
		[
			{id:3, name: 'contactPhone', label: '联系电话', value: [''], display: true,},
		],
		[
			{id:4, name: 'recvAddr', label: '收货地址', value: [''], display: true,},
		],
	],
	payInfo: [
		[
			{id:5, name: 'totalPrice', label: '商品总价', value: [''], display: true,},
		],
		[
			{id:6, name: 'postage', label: '运费', value: [''], display: false,},
		],
		[
			{id:7, name: 'promotion', label: '促销优惠', value: [''], display: true,},
		],
		[
			{id:8, name: 'invoice', label: '发票信息', value: [''], display: true,},
		],
		[
			{id:9, name: 'payPrice', label: '实付', value: ['', ''], display: true,},
		],
	],
	deliveryInfo: [
		[
			{id:10, name: 'orderNo', label: '订单编号', value: [''], display: true,},
		],
		[
			{id:11, name: 'payMethod', label: '支付方式', value: [''], display: true,},
		],
		[
			{id:12, name: 'delivery', label: '物流方式', value: [''], display: true,},
		],
		[
			{id:13, name: 'commitTime', label: '下单时间', value: [''], display: true,},
		],
	],
	orderStatus: 1,
	logisticsType: 1,
	shopName: '',
	prdtList: [
		// {image: '111.jpg', name: 'kkk', desc: '好味道', price: '00.00', count: '11',},
		// {image: '222.jpg', name: 'kkk', desc: '好味道22222', price: '200.33', count: '1',},
	],
};

export default state;