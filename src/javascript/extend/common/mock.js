/**
 * This module is used for local testing
 * add new mock data if backend haven't implement the logic yet
 */

let mock = {
	'query/item': require('data/queryItem.json'),
	'query/units': require('data/queryUnits.json'),
	'item/getPrdtDetail': require('data/item/getPrdtDetail.json'),
	'cart/getCartStatus': require('data/cart/getCartStatus.json'),
	'cart/addCart': require('data/cart/addCart.json'),
	'cart/addCartError': require('data/cart/addCartError.json'),
	'address/getAddressList': require('data/address/getAddressList.json'),
	'order/getOrderList': require('data/order/getOrderList.json'),
	'user/getUserInfo': require('data/user/getUserInfo.json'),
	'gift/pushlist':require('data/YQData/giftlist.json')

};

module.exports = mock;