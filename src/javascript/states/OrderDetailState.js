let state = {
	forms: [
		[
			{id:1, name: 'shopName', label: '店铺名称', value: '四季严选', display: true,},
		],
		[
			{id:2, name: 'orderId', label: '定单ID', value: '111', display: false,},
		],
		[
			{id:3, name: 'orderNo', label: '定单编号', value: '123456', display: true,},
		],
		[
			{id:4, name: 'commitTime', label: '下单时间', value: '2015-11-11 23:31:24', display: true,},
		],
		[
			{id:5, name: 'addrInfo', label: '收货信息', value: '近江时代大厦', display: true,},
		],
		[
			{id:6, name: 'payMethod', label: '支付方式', value: '微信', display: true,},
		],
		[
			{id:7, name: 'totalPrice', label: '商品金额', value: '￥200.00', display: true,},
			{id:8, name: 'favourable', label: '活动优惠', value: '￥00.00', display: true,},
			{id:9, name: 'coupon', label: '优惠券', value: '￥1.00', display: true,},
			{id:10, name: 'redPacket', label: '红包', value: '￥00.00', display: true,},
			{id:11, name: 'payPrice', label: '实付', value: '￥199.00', display: true, highlight: true, extra: '（含邮费￥15.24）'},
		],
	],
	orderStatus: 1,
	logisticsType,
	shopName,
	prdtList: [
		{id: 1, image: '111.jpg', name: 'kkk', desc: '好味道', price: '400.33', count: '11',},
		{id: 1, image: '111.jpg', name: 'kkk', desc: '好味道22222', price: '200.33', count: '1',},
	],
};

export default state;