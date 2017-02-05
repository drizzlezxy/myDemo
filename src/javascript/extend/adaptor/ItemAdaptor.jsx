import BaseAdaptor from './BaseAdaptor';

export default class ItemAdaptor extends BaseAdaptor {

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
		    categoryId,
		    desc,
		    detailList,
		    imageList,
		    specList,
		    itemSaleParamDTOList,
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
			name: name,
		  	desc: desc,
		  	payPrice: skuList[0].payPrice || 29.00,
		  	originPrice: skuList[0].originPrice || 199.00,
		  	delivery: '全国包邮（港澳台和偏远地区不发货）',
		  	place: '',
		  	unitPrice: '',
		  	brandName,
		};

		this.data.detailList = detailList;

		return this.data;
	}

	postProcessData() {
		return this.data;
	}
}