export class SKU {
	constructor(data = {
		"id": 46,
        "prdtId": 95,
        "spec": "500g",
        "originPrice": 99,
        "payPrice": 0.02,
        "count": 97,
        "status": 1,
        "skuSaleEntryDTOList": [
              {
                  "saleParamId": 1086,
                  "itemSaleParamOptionId": 1014
              },
              {
                  "saleParamId": 1085,
                  "itemSaleParamOptionId": 1012
              }
          ]
	}) {

		this.id = id;
		this.prdtId = prdtId;
		this.spec = spec;
		this.originPrice = originPrice;
		this.payPrice = payPrice;
		this.count = count;
		this.status = status;
		this.sku = skuSaleEntryDTOList.map((item, index) => {
			return item.itemSaleParamOptionId;
		}).join('|');
	}

	static statusMap = new Map({
		1: 'VALID',
	});
}