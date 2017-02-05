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
	cartCount: 0,
	detailList: [],
	skuList: [],
	selectedKeyMap: {},
	selectedSkuId: null,
	selectedSkuCount: -1,
	currentCount: 1,
	enter: false,
	message: '',
	paramList: [
  	// 	{
	  // 		id: 1,
	  // 		name: 'weight',
	  // 		list: [
			// ],
			// blockIndexList: [],
			// width: 300,
			// marginRight: 5,
			// rowCount: 3,
  	// 	},
  	// 	{
  	// 		id: 2,
	  // 		name: 'flavor',
	  // 		list: [
			// 	{id: 4, label: '辣', value: 1,},
			// 	{id: 5, label: '甜', value: 2,},
			// 	{id: 6, label: '酸', value: 3,},
			// 	{id: 7, label: '苦', value: 4,},
			// 	{id: 8, label: '咸', value: 4,},
			// ],
			// blockIndexList: [],
			// width: 300,
			// marginRight: 4,
			// rowCount: 5,
  	// 	}
  	]
};

export default state;