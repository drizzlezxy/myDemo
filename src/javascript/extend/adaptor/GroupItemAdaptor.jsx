import BaseAdaptor from './BaseAdaptor';

export default class GroupItemAdaptor extends BaseAdaptor {

	constructor(data) {
		super(data);

		this.init();
	}

	preProcessData() {
		return this.data;
	}

	transform() {
		let {
			skuList,
			id,
		    title,
		    name,
		    brandName,
		    skuName,
		    categoryId,
		    desc,
		    detailList,
		    imageList,
		    specList,
		    itemSaleParamDTOList,
		    promotionSalePrice,
		    skuSalePrice,
		    skuMarketPrice,
		    peopleNum,
		    poStatus,
		    poSkuId, // 拼团skuId
		    skuId, // skuId用于单独购买
		} = this.data;
		
		this.data.paramList = itemSaleParamDTOList.map(function(saleParam) {
          	let {
          		saleParamId,
          		saleParamName,
          		itemSaleParamOptionDTOList,
          	} = saleParam;

          	let list = itemSaleParamOptionDTOList.map((item) => {
          		let {
                  id,
                  imgUrl,
                  saleParamId,
                  value,
              	} = item;

              	return {
					id: id, 
					imgUrl: imgUrl, 
					label: value, 
					value: value,
				};
          	});

          	return {
          		id: saleParamId,
				name: saleParamName,
				list: list,
				blockIndexList: [],
				width: 300,
				marginRight: 10,
				rowCount: 3,
			};
			
		});

		this.data.skuList = skuList.length && skuList.map((skuItem) => {
			let {
				id,
				prdtId,
				spec,
				originPrice,
				payPrice,
				count,
				status,
				skuSaleEntryDTOList,
			} = skuItem;
			let sku = skuSaleEntryDTOList && skuSaleEntryDTOList.map((param) => {
				return param.itemSaleParamOptionId;
			}).join('|') || null;
			
			return {
				id,
				prdtId,
				spec,
				originPrice,
				payPrice,
				count,
				status,
				sku: sku,
			};
		}) || [];


		this.data.basic = {
			name: skuName,
			brandName,
		  	desc: desc,
		  	payPrice: promotionSalePrice || skuList[0].payPrice || "00.00",
		  	originPrice: skuMarketPrice || skuList[0].originPrice || "00.00",
		  	delivery: '全国包邮（港澳台和偏远地区不发货）',
		  	place: '',
		  	unitPrice: '',
		  	skuId,
		  	poSkuId,
		};

		this.data.detailList = detailList;

		this.data.footer = [
			{
				id: 1,
				price: skuSalePrice,
				label: '单独购买',
				arrow: '',
				url: 'singleBuy',
				styleObj: {
					flex: 25,
					WebkitFlex: 25,
					background: '#343434',
				},
			},
			{
				id: 2,
				price: promotionSalePrice,
				label: `${peopleNum}人团 去开团`,
				arrow: ' >',
				url: 'groupBuy',
				styleObj: {
					flex: 39,
					WebkitFlex: 39,
					background: '#E63325',
				}
			},
		];

		return this.data;
	}

	postProcessData() {
		return this.data;
	}
}