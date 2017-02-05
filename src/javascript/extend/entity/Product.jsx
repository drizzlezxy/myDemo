import SKU from 'extend/entity/SKU';

export default class Product {
	constructor(data = {
        "id": 95,
        "name": "山药薏米芡实粉",
        "brandName": "千岛湖",
        "image": "http://paopao.nosdn.127.net/646f7d73-5a5f-4b41-b013-844b1ac0b100?imageView&quality=85&thumbnail=800y800&interlace=1",
        "originPrice": 99,
        "payPrice": 0.02,
        "skuList": [
          {
            "id": 46,
            "prdtId": 95,
            "spec": "500g",
            "originPrice": 99,
            "payPrice": 0.02,
            "count": 97,
            "status": 1
          },
          {
            "id": 47,
            "prdtId": 95,
            "spec": "1000g",
            "originPrice": 199,
            "payPrice": 0.5,
            "count": 5,
            "status": 1
          }
        ],
        default: true,
      }) {

      this.id = id;
      this.name = name;
      this.brandName = brandName;
      this.image = image;
      this.originPrice = originPrice;
      this.payPrice = payPrice;
      this.skuList = skuList.map(function(sku) {
      	return new SKU(sku);
      });
	}
}