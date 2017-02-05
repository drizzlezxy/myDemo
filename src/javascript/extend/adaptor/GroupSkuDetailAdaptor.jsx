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

		let newObj = {};
		let {data} = this.data;

		console.log('data', data);
		newObj.groupItemList = data.map((item) => {
			let {
				poSkuUrl,
		        skuName,
		        peopleNum,
		        shareId,
		        skuDescription,
		        promotionSalePrice,
		        createDate,
		        skuSalePrice,
		        skuMarketPrice,
		        skuId,
		        poSkuId,
		        imageUrl,
		        skuDesc,
		        itemId,
		        count,
		        id,
		        skuStatus,
		        poSkuStatus,
			} = item;
			return {
				id, 
				poSkuId, 
				skuId, 
				name: skuName, 
				desc: skuDescription, 
				discount: "0.0", 
				groupCount: peopleNum, 
				unitPrice: promotionSalePrice, 
				marketPrice: skuMarketPrice, 
				prdtImage: imageUrl,
				status: skuStatus,
				poSkuStatus,
			};
		});

		return (this.data = newObj);
	}

	postProcessData() {
		return this.data;
	}
}