let state = {
	imageList: [
	],
	basic: {
		name: '',
	  	desc: '',
	  	payPrice: 0.00,
	  	originPrice: 0.00,
	  	delivery: '全国包邮（港澳台和偏远地区不发货）',
	  	place: '产地',
	  	unitPrice: '单价',
	  	brand: '四季严选',
	},
	memberList: [
		{
			id: 1, name: 'cc', headImage: 'aaa', place: '杭州', remain: 4, groupId: 101, isLeader: true, startTime: 1480613008123,
		},
		{
			id: 2, name: 'dd', headImage: 'aaa', place: '北京', remain: 4, groupId: 102, isLeader: false, startTime: 1480613018121,
		}
	],
	cartCount: 0,
	detailList: [],
	skuList: [],
	selectedKeyMap: {},
	selectedSkuId: null,
	selectedSkuCount: -1,
	currentCount: 1,
	enter: false,
	message: '',
	paramList: [],
	footer:[
		{
			id: 1,
			price: 80.00,
			label: '单独购买',
			arrow: '',
			url: 'aaa',
			styleObj: {
				flex: 25,
				WebkitFlex: 25,
				background: '#343434',
			},
		},
		{
			id: 2,
			price: 55.00,
			label: '5人团 去开团',
			arrow: ' >',
			url: 'bbb',
			styleObj: {
				flex: 39,
				WebkitFlex: 39,
				background: '#E63325',
			},
		},
	]
};

export default state;