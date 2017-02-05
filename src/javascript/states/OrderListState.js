let state = {
	orderList: [
		{
			id: null,
			shopId: null,
			businessId: null,
			buttonList: [],
			expressNum: null,
			shopName: '',
			orderStatus: null,
			submitDate: null,
			orders: [
				// {
				// 	name: '三文鱼',
				// 	desc: '三文鱼三文鱼，好吃的三文鱼',
				// 	price: '122.00',
				// 	image: null,
				// 	brandNameEN: null,
				// 	brandNameZH: null,
				// 	attributeList: [
				// 		{id:'', name:'',}
				// 	],
				// 	tag: null,
				// 	id: 1,
				// 	prdtId: 1,
				// 	count: 2,
				// 	skuSum: 3,
				// 	statusStr: 'adsf',
				// 	isGroup: true,
				// 	groupId: 101,
				// },
				// {
				// 	name: '三文鱼',
				// 	desc: '三文鱼三文鱼，好吃的三文鱼',
				// 	price: '122.00',
				// 	image: null,
				// 	brandNameEN: null,
				// 	brandNameZH: null,
				// 	attributeList: [
				// 		{id:'', name:'',}
				// 	],
				// 	tag: null,
				// 	id: 1,
				// 	prdtId: 1,
				// 	count: 2,
				// 	skuSum: 3,
				// 	statusStr: 'adsf',
				// 	isGroup: true,
				// 	groupId: 101,
				// },
			],
			totalPrice: '0.00',
		},
	],
	currentList: [],
	tabTree: {
		activeIndex : 0,
		//0:全部 1:待支付 2:待成团 3:待发货 4:待收货
		items: [
			{
				label: '全部订单',
				display: true,
				items: null
			},
			{
				label: '待支付',
				display: true,
				items: null
			},
			{
				label: '待成团',
				display: true,
				items: null
			},
			{
				label: '待发货',
				display: true,
				items: null
			},
			{
				label: '已发货',
				display: true,
				items: null
			}
		],
	},
	currentTabItems : []
};

export default state;