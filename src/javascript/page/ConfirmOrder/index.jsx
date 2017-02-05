import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import Util from "extend/common/util";
import RequestUtil from "extend/common/RequestUtil";
import WeixinUtil from "extend/common/WeixinUtil";
import RedirectUtil from "extend/common/RedirectUtil";
import LoginUtil from "extend/login/loginUtil";
import PayUtil from "extend/common/PayUtil";
import Logger from "extend/common/Logger";
import ConfirmOrderState from 'states/ConfirmOrderState';
import PayChannel from 'components/PayChannel/PayChannel';
import Invoice from 'components/Invoice/Invoice';
import OrderShopList from 'components/OrderShopList/OrderShopList';
import Protocol from 'components/Protocol/Protocol';
import SelfPickedList from 'components/SelfPickedList/SelfPickedList';
import Notification from 'components/Notification/Notification';
import ShopListAdaptor from 'extend/adaptor/ShopListAdaptor';
import OldOrderAdaptor from 'extend/adaptor/OldOrderAdaptor';
import SkuAlgorithm from 'extend/algorithm/SkuAlgorithm';
import 'scss/base.scss';
import 'scss/ConfirmOrder/index.scss';
import CONSTANTS from 'extend/constants/constants.json';

class MyComponent extends Component {
	constructor (props) {
		super(props);

		this.state = ConfirmOrderState;
	}

	componentDidMount() {
		this.initAuth();
		//this.init();
		
		WeixinUtil.hideWeixinMenu();
	}

	initAuth() {
		let appInfo = {
			env: 'WX',
		};

		let queryObj = Util.parseQueryString(location.href);
		let extraParam = {
			pageId: 'ConfirmOrder',
			queryObj: queryObj,
			options: {},
		};

		LoginUtil.login({
			appInfo,
			extraParam,
		}, (userMsg, gotStatus) => {
			this.authCallback(userMsg, gotStatus);
			this.init();
		});
	}

	authCallback(userMsg, gotStatus) {
		const {gotError, gotInfoWrong, gotNotBinded, gotInfo} = LoginUtil.loginResultStatus;
		switch(gotStatus) {
			case gotError: 
			case gotInfoWrong:
				break;

			case gotNotBinded:
				LoginUtil.toBindPhone();
				break;

			case gotInfo:
				this.setUserInfo(userMsg);
				break;

			default:
				break;
		}
	}

	setUserInfo(userMsg) {
		//console.log('userMsg', userMsg);
	}

	init() {
		if (Util.isOldOrder()) {
			this.resetOldOrder((result) => {
				let {orderDetail} = result;

				this.resetCurrentState(orderDetail);
			});
		} else {
			this.resetItemInfo();
		}
	}

	resetCurrentState(orderDetail) {
		let oldOrderState = new OldOrderAdaptor(orderDetail).getData();
		console.log('oldOrderState', oldOrderState);
		this.setState(oldOrderState, () => {
		});
	}

	/**
	 * [resetOldOrder 重置历史订单，不允许用户修改订单信息]
	 * @Author   JohnNong
	 * @Email    overkazaf@gmail.com
	 * @Github   https://github.com/overkazaf
	 * @DateTime 2016-12-10T20:37:49+0800
	 * @return   {[type]}                     [description]
	 */
	resetOldOrder(callback) {
		let param = {
			url: 'order/getOrderDetail',
			data:  {
				userId: Util.fetchUserId(),
				orderId: Util.fetchValueByCurrentURL('orderId'),
				promotionType: 0,
			},
			successFn: (data) => {
				if (RequestUtil.isResultSuccessful(data)) {
					callback && callback(data.result);
				} else {

				}
			},
			errorFn: () => {

			}
		};

		RequestUtil.fetch(param);
	}

	resetInvoice(isInvoice, invoiceTitle) {

	}

	/**
	 * [getOldOrder 获取历史订单信息]
	 * @Author   JohnNong
	 * @Email    overkazaf@gmail.com
	 * @Github   https://github.com/overkazaf
	 * @DateTime 2016-12-10T20:44:47+0800
	 * @param    {[type]}                     success [description]
	 * @param    {[type]}                     error   [description]
	 * @return   {[type]}                             [description]
	 */
	getOldOrder(success, error) {
		let orderId = Util.fetchValueByCurrentURL('orderId');
		let userId = Util.fetchValueByCurrentURL('userId');
		let that = this;
		let param = {
			url: 'posku/getPoOrder',
			method: 'POST',
			data: {
				orderId,
				userId,
			},
			successFn: (data) => {
				if (RequestUtil.isResultSuccessful(data)) {
					success && success(data.result);
				} else {
					error && error(data.result);
				}
			},
			errorFn: () => {
				this.showNotification('网络异常，请检查网络');
			},
		};

		RequestUtil.fetch(param);
	}

	/**
	 * [resetGroupOrderPrice 重置团订单信息]
	 * @Author   JohnNong
	 * @Email    overkazaf@gmail.com
	 * @Github   https://github.com/overkazaf
	 * @DateTime 2016-12-10T20:38:24+0800
	 * @param    {[type]}                     option   [description]
	 * @param    {Function}                   callback [description]
	 * @return   {[type]}                              [description]
	 */
	resetGroupOrderPrice(option, callback) {
		let orderPriceParam = null;
		let {
			address: {
				addressId,
			},
			currentDeliveryType,
		} = this.state;

		if (Util.isExisty(addressId)) {
			orderPriceParam = {
				userId: Util.fetchUserId(),
				poSkuId: Util.fetchValueByCurrentURL('poSkuId'),
				atonceSkuId: Util.fetchValueByCurrentURL('skuId'),
				addressId,
				expressType: currentDeliveryType,
			};
		} else {
			orderPriceParam = {
				userId: Util.fetchUserId(),
				poSkuId: Util.fetchValueByCurrentURL('poSkuId'),
				atonceSkuId: Util.fetchValueByCurrentURL('skuId'),
				expressType: currentDeliveryType,
			};
		}

		let resetParam = {
			url: 'posku/getOrderPrice',
			data: orderPriceParam,
			successFn: (data) => {
				if (RequestUtil.isResultSuccessful(data)) {
					callback && callback(data.result);
				} else {
					console.error('callback');
				}
			},
			errorFn: (data) => {
				this.showNotification(CONSTANTS.MSG.NETWORK.NETWORK_EXCEPTION);
			},
		};

		RequestUtil.fetch(resetParam);
	}


	resetItemInfo(callback) {
		this.resetUserAddress((result) => {
			this.setDefaultAddress(result.list, () => {
				if (callback) {
					callback();
				} else {
					this.calcCurrentOrderPrice();
				}
			});
		});
	}

	calcCurrentOrderPrice() {
		if (Util.isGroupBuy()) {
			this.resetGroupOrderPrice({}, (data) => {
				let {orderToCommit} = data;
				this.resetShopListInfo(orderToCommit);
			});
		} else {
			this.resetOrderPrice({}, (data) => {
				let {orderToCommit} = data;
				this.resetShopListInfo(orderToCommit);
			});
		}
	}

	resetPriceInfo(orderToCommit) {
		let {
			carriageFee,
			finalPrice,
		} = orderToCommit;

		this.setState({
			totalPrice: finalPrice,
			postage: carriageFee,
		});
	}

	resetShopListInfo(orderToCommit) {
		let {
			payChannel,
			couponList,
			prdtList,
			address,
			carriageFee,
			finalPrice,
			commitType,
		} = orderToCommit;

		let newShopList = new ShopListAdaptor(prdtList).getData();

		console.log('newShopList', newShopList);

		this.resetDeliveryList(newShopList, (list, index) => {
			let currentShop = newShopList[index];
			currentShop.deliveryInfo.deliveryAddressList = list.map((listItem, idx) => {
				let {
					id,
					siteName,
					address,
				} = listItem;

				return {
					id,
					siteName,
					address,
				}
			});

			this.setState({
				totalPrice: finalPrice,
				postage: carriageFee,
				shopList: newShopList,
			});
		});
	}

	resetDeliveryList(shopList, callback) {
		Util.isExisty(shopList) && shopList.map((shop, index) => {
			let {shopId} = shop;
			let selfPickUpParam = {
				url: 'pick/getPickUpSite',
				data: {
					shopId: shopId,
				},
				successFn: (result) => {
					if (RequestUtil.isResultSuccessful(result)) {
						callback && callback(result.result, index);
					}
				},
				errorFn: (...args) => {
					Logger.log(args);
				}
			};

			setTimeout(() => {
				RequestUtil.fetch(selfPickUpParam);
			}, index * 200);
		});
	}

	getSelfPickupId() {
		let {
			shopList,
		} = this.state;

		if (shopList.length) {
			let currentShop = shopList[0];

			let {deliveryInfo: {
				selected,
				deliveryAddressList,
			}} = currentShop;

			return deliveryAddressList[selected].id;
		} else {
			return -1;
		}
	}


	/**
	 * [getOrderPriceParamByExpressType 获取订单价格的参数项]
	 * @Author   JohnNong
	 * @Email    overkazaf@gmail.com
	 * @Github   https://github.com/overkazaf
	 * @DateTime 2016-12-06T15:26:43+0800
	 * @return   {[type]}                     [description]
	 */
	getOrderPriceParamByExpressType(expressType = 1) {
		let {address} = this.state;
		let selectedIdList = Util.fetchValueByCurrentURL('selectedIdList');
		// 是否选中了自提点
		let isSelfPickup = (expressType == 2);
		let addressId = Util.isExisty(address) && address.addressId || null;
		// 是否来自购物车的跳转
		let isFromCart = Util.isExisty(selectedIdList);

		if (isSelfPickup) {
			// 自提点的话，地址id用自提点id
			addressId = this.getSelfPickupId();
		}

		let orderData = isFromCart ? 
					    {
							userId: Util.fetchUserId(),
							selectedIdList: JSON.stringify(selectedIdList.split(',').map((v) => {
								return parseInt(v, 10);
							})),
							addressId,
							expressType,
						} :
						{
							userId: Util.fetchUserId(),
							atonceSkuId: Util.fetchValueByCurrentURL('skuId'),
							atonceCount: Util.fetchValueByCurrentURL('skuCount'),
							addressId,
							expressType,
						};

		return orderData;
	}

	resetOrderPrice(option = {}, callback) {
		let orderPriceParam = this.getOrderPriceParamByExpressType(option.expressType);
		let resetParam = {
			url: 'order/getOrderPrice',
			data: orderPriceParam,
			successFn: (data) => {
				if (RequestUtil.isResultSuccessful(data)) {
					callback && callback(data.result);
				} else {
					console.error('callback');
				}
			},
			errorFn: (data) => {
				this.showNotification(CONSTANTS.MSG.NETWORK.NETWORK_EXCEPTION);
			},
		};

		RequestUtil.fetch(resetParam);
	}

	resetUserAddress(callback) {
		let addrParam = {
			url: 'address/getAddressList',
			method: 'post',
			data: {
				userId: Util.fetchUserId(),
			},
			successFn: (data) => {
				if (RequestUtil.isResultSuccessful(data)) {
					callback && callback(data.result);
				}
			},
			errorFn: (data) => {

			},
		};

		RequestUtil.fetch(addrParam);
	}

	setDefaultAddress(list, callback) {

		let addressId = Util.fetchValueByCurrentURL('addressId');
		let defaultAddressList = list.filter((addr) => {
			if(!!addressId) {
				return addr.addressId == addressId;
			}
			return addr.isDefault === 1;
		});

		if (!defaultAddressList.length) {
			if (Util.isExisty(list[0])) {
				defaultAddressList = [list[0]];
			}
		}

		let clonedAddress = Util.deepClone(this.state.address);
		if (defaultAddressList.length) {
			let defaultAddress = defaultAddressList[0];
			clonedAddress.addressId = defaultAddress.addressId;
			clonedAddress.addressString = defaultAddress.addressString;
			clonedAddress.name = defaultAddress.name;
			clonedAddress.phone = defaultAddress.phone;
			clonedAddress.tel = defaultAddress.tel;
			clonedAddress.detail = defaultAddress.address;
		} else {
			clonedAddress = new Address({});
		}

		this.setState({
			address: clonedAddress,
		}, () => {
			callback && callback();
		});
	}

	handleInvoiceChange() {
		if (Util.isOldOrder()) return;
		let {
			invoice,
		} = this.state;

		let clonedInvoice = Util.deepClone(invoice);
		clonedInvoice.checked = !clonedInvoice.checked;

		this.setState({
			invoice: clonedInvoice,
		});
	}

	handleInvoiceTitleChange(invoiceTitle) {
		if (this.state.isOldOrder) return;

		let {
			invoice,
		} = this.state;

		let clonedInvoice = Util.deepClone(invoice);
		clonedInvoice.invoiceTitle = invoiceTitle;

		this.setState({
			invoice: clonedInvoice,
		});
	}

	handleInvoiceTypeChange(type) {
		let {
			invoice,
		} = this.state;

		let clonedInvoice = Util.deepClone(invoice);
		clonedInvoice.type = type;
		this.setState({
			invoice: clonedInvoice,
		});
	}

	handleProtocolChange() {
		if (this.state.isOldOrder) return;

		let {
			protocol,
		} = this.state;

		let clonedProtocol = Util.deepClone(protocol);
		clonedProtocol.checked = !clonedProtocol.checked;

		this.setState({
			protocol: clonedProtocol,
			payEnabled: clonedProtocol.checked,
		});
	}

	handlePayChangeClick() {
	}

	handleAddressClick() {
		if (this.state.isOldOrder) return;

		let queryObj = Util.parseQueryString(location.href);
		let pageName = 'DeliveryAddr';
		let hrefString = location.href.toString();
		let fixedHref = hrefString.indexOf('?') >= 0 ?
						hrefString.split('?')[0] :
						location.href;

		RedirectUtil.redirectPage({
			pageName: pageName,
			options: Object.assign(queryObj, {
				funcType: 'select',
				redirect_url: fixedHref,
			}),
		});
	}

	handlePickedDetailClick() {
		if (this.state.isOldOrder) return;

		this.setState({
			isSelfPickedListActive: true,
		});
	}

	showNotification(message, timeout = 3000) {
		this.setState({
			enter: true,
			message: message,
		}, () => {
			setTimeout(() => {
				this.leave();
			}, timeout);
		});
	}

	leave() {
		this.setState({
		  enter: false,
		});
	}

	handleDeliveryTypeChange(shopId, typeId) {
		if (this.state.isOldOrder) return;

		let {
			shopList,
		} = this.state;

		let clonedShopList = Util.deepClone(shopList);
		
		let targetShop = clonedShopList.filter((shop, index) => {
			return shop.shopId == shopId;
		});


		if (targetShop.length) {
			targetShop[0].deliveryTypes.map((dType, index) => {
				if (dType.id === typeId) {
					dType.isActive = true;
				} else {
					dType.isActive = false;
				}
			});

			this.setState({
				currentDeliveryType: typeId,
				shopList: clonedShopList,
			}, () => {
				if (Util.isGroupBuy()) {
					this.resetGroupOrderPrice({expressType: typeId}, (data) => {
						let {orderToCommit} = data;
						this.resetPriceInfo(orderToCommit);
					});
				} else {
					this.resetOrderPrice({expressType: typeId}, (data) => {
						let {orderToCommit} = data;
						this.resetPriceInfo(orderToCommit);
					});
				}
			});
		}
	}

	setPayButtonDisabled(callback) {
		this.setState({
			payEnabled: false,
		}, () => {
			callback && callback();
		});
	}

	handlePay() {

		if (!Util.isOldOrder()) {
			let commitGroupBuySuccessFn = (data) => {
				let {
					orderId,
					groupId,
				} = data.result;
				//console.log('group data.result', data.result);
				//alert(`orderId:${orderId}, groupId:${groupId}`);
				PayUtil.wxPay(data.result, (errorCode, option) => {

					// 用户取消后跳转到待支付定单
					if (errorCode != 'SUCCESS') {
						RedirectUtil.redirectPage({
							pageName: 'OrderList',
							options: Object.assign({
								type: 1,
							}, {}),
						});
					}

					PayUtil.doPostPay(errorCode, option, (result) => {
						// jump to pay success page
						let pageName;
						if (errorCode === 'SUCCESS') {
							pageName = 'GroupInvite';
						} else {
							pageName = 'PayFail';
						}

						RedirectUtil.redirectPage({
							pageName: pageName,
							options: Object.assign({
								orderId,
								groupId,
								poSkuId: Util.fetchValueByCurrentURL('poSkuId'),
							}, {

							}),
						});
					});
				});
			};

			let commitNormalBuySuccessFn = (data) => {
				//console.log('normal data.result', data.result);
				let {
					orderIdList,
				} = data.result;
				let orderIds = orderIdList.split(',');
				let orderId = orderIds[0];
				PayUtil.wxPay(data.result, (errorCode, option) => {

					// 用户取消后跳转到待支付定单
					if (errorCode != 'SUCCESS') {
						RedirectUtil.redirectPage({
							pageName: 'OrderList',
							options: Object.assign({
								type: 1,
							}, {}),
						});
					}

					PayUtil.doPostPay(errorCode, option, (result) => {
						// jump to pay success page
						let pageName;
						if (errorCode === 'SUCCESS') {
							pageName = 'PaySuccess';
						} else {
							pageName = 'PayFail';
						}

						RedirectUtil.redirectPage({
							pageName: pageName,
							options: Object.assign({
								orderId: orderId,
							}, {}),
						});
					});
				});
			};


			let that = this;
			if (this.validateBeforePay()) {
				this.setPayButtonDisabled(() => {
					if (Util.isGroupBuy()) {
						this.doGroupPay(commitGroupBuySuccessFn, (data) => {
							this.showNotification(data.message);
						});
					} else {
						this.doPay(commitNormalBuySuccessFn, (data) => {
							this.showNotification(data.message);
						});
					}
				});
			}
		} else {
			// recommit
			this.setPayButtonDisabled(() => {
				this.handleRecommit((data) => {
					PayUtil.wxPay(data.result, (errorCode, option) => {

						// 用户取消后跳转到待支付定单
						if (errorCode != 'SUCCESS') {
							RedirectUtil.redirectPage({
								pageName: 'OrderList',
								options: Object.assign({
									type: 1,
								}, {}),
							});
						}

						PayUtil.doPostPay(errorCode, option, (result) => {
							let pageName;
							if (errorCode === 'SUCCESS') {
								pageName = 'PaySuccess';
							} else {
								pageName = 'PayFail';
							}

							// 普通商品跳转
							RedirectUtil.redirectPage({
								pageName: pageName,
								options: Object.assign({
									orderId: Util.fetchValueByCurrentURL('orderId'),
								}, {}),
							});

						});
					});
				}, (data) => {
					// error
					this.showNotification(data.message);
				});
			});
		}
	}

	handleRecommit(successFn, errorFn) {
		let that = this;
		let param = {
			url: 'order/recommitOrder',
			data: {
				userId: Util.fetchUserId(),
				orderId: Util.fetchValueByCurrentURL('orderId'),
				payChannel: 2,
				openId: Util.fetchOpenId(),
			},
			successFn: (data) => {
				if (RequestUtil.isResultSuccessful(data)) {
					successFn && successFn(data);
				} else {
					errorFn && errorFn(data);
				}
			},
			errorFn: () => {
				this.showNotification('网络异常，请检查网络');
			},
		};

		RequestUtil.fetch(param);
	}

	getPayParamDataByType(paramType) {
		let {
			address: {
				addressId,
			},
			payChanel: {
				selected,
				channels,
			},
			invoice: {
				checked,
				type,
				invoiceTitle,
				types,
			},
			currentDeliveryType,
			postage,
			totalPrice,
		} = this.state;
		let payChannel = channels[selected].id;
		let invoiceType = types[type].value;
		let selectedIdList = Util.fetchValueByCurrentURL('selectedIdList');
		let payParamData;
		let isSelfPickup = (currentDeliveryType == 2);
		if (isSelfPickup) {
			// 自提点的话，地址id用自提点id
			addressId = this.getSelfPickupId();
		}

		if (paramType === 'group') {
			if (checked) {
				// 选中开发票
				payParamData = {
					poSkuId: Util.fetchValueByCurrentURL('poSkuId'),
					atonceSkuId: Util.fetchValueByCurrentURL('skuId'),
					groupId: Util.fetchValueByCurrentURL('groupId'),
					expressType: currentDeliveryType,
					userId: Util.fetchUserId(),
					addressId: addressId,
					payChannel: 2,
					carriageFee: postage,
					finalPrice: totalPrice,
					openId: Util.fetchOpenId(),
					isInvoice: 1,
					invoiceTitle,
					invoiceType,
					promotionType: 2,
					orderSource: 1,
				 };
			} else {
				payParamData = {
					poSkuId: Util.fetchValueByCurrentURL('poSkuId'),
					atonceSkuId: Util.fetchValueByCurrentURL('skuId'),
					groupId: Util.fetchValueByCurrentURL('groupId'),
					expressType: currentDeliveryType,
					userId: Util.fetchUserId(),
					addressId: addressId,
					payChannel: 2,
					carriageFee: postage,
					finalPrice: totalPrice,
					openId: Util.fetchOpenId(),
					promotionType: 2,
					orderSource: 1,
				 };
			}
		} else if (paramType === 'normal') {
			if (Util.isExisty(selectedIdList)) {
				// 购物车进入
				if (checked) {
					// 选中开发票
					payParamData = {
						expressType: currentDeliveryType,
						userId: Util.fetchUserId(),
						addressId: addressId,
						payChannel: 2,
						selectedIdList: JSON.stringify(selectedIdList.split(',').map((v) => {
							return parseInt(v, 10);
						})),
						carriageFee: postage,
						finalPrice: totalPrice,
						openId: Util.fetchOpenId(),
						isInvoice: 1,
						invoiceTitle,
						invoiceType,
						promotionType: 0,
						orderSource: 1,
					 };
				} else {
					payParamData = {
						expressType: currentDeliveryType,
						userId: Util.fetchUserId(),
						addressId: addressId,
						payChannel: 2,
						selectedIdList: JSON.stringify(selectedIdList.split(',').map((v) => {
							return parseInt(v, 10);
						})),
						carriageFee: postage,
						finalPrice: totalPrice,
						openId: Util.fetchOpenId(),
						promotionType: 0,
						orderSource: 1,
					 };
				}
			} else {
				// 立即购买
				if (checked) {
					// 选中开发票
					payParamData = {
						expressType: currentDeliveryType,
						userId: Util.fetchUserId(),
						addressId: addressId,
						payChannel: 2,
						atonceSkuId: Util.fetchValueByCurrentURL('skuId'),
						atonceCount: Util.fetchValueByCurrentURL('skuCount'),
						carriageFee: postage,
						finalPrice: totalPrice,
						openId: Util.fetchOpenId(),
						isInvoice: 1,
						invoiceTitle,
						invoiceType,
						promotionType: 0,
						orderSource: 1,
					 };
				} else {
					payParamData = {
						expressType: currentDeliveryType,
						userId: Util.fetchUserId(),
						addressId: addressId,
						payChannel: 2,
						atonceSkuId: Util.fetchValueByCurrentURL('skuId'),
						atonceCount: Util.fetchValueByCurrentURL('skuCount'),
						carriageFee: postage,
						finalPrice: totalPrice,
						openId: Util.fetchOpenId(),
						promotionType: 0,
						orderSource: 1,
					 };
				}
			}
		}

		return payParamData;
	}

	doGroupPay(successFn, errorFn) {
		let payParamData = this.getPayParamDataByType('group');
		let that = this;

		//console.log('payParamData', payParamData);
		let payParam = {
			url: 'posku/commitOrder',
			method: 'post',
			data: payParamData,
			successFn: (data) => {
				if (RequestUtil.isResultSuccessful(data)) {
					successFn && successFn(data);
				} else {
					Logger.log('data from posku/commitOrder', data);
					errorFn && errorFn(data);
				}
			},
			errorFn: (...args) => {
				this.showNotification('网络异常，请检查网络');
			},
		}

		RequestUtil.fetch(payParam);
	}

	validateBeforePay() {
		let that = this;
		let {
			address: {
				addressId,
			},
			currentDeliveryType,
		} = this.state;

		if (currentDeliveryType === 1) {
			if (!Util.isExisty(addressId)) {
				that.showNotification('您还未选择收货地址');
				return false;
			}
		}
		return true;
	}

	doPay(successFn, errorFn) {
		let payParamData = this.getPayParamDataByType('normal');
		let that = this;
		let payParam = {
			url: 'order/commitOrder',
			method: 'post',
			data: payParamData,
			successFn: (data) => {
				if (RequestUtil.isResultSuccessful(data)) {
					successFn && successFn(data);
				} else {
					errorFn && errorFn(data);
				}
			},
			errorFn: (...args) => {
				this.showNotification('网络异常，请检查网络');
			},
		};


		this.setPayButtonDisabled(() => {
			RequestUtil.fetch(payParam);
		});
	}

	showNotification(message, timeout = 3000) {
		this.setState({
			enter: true,
			message: message,
		}, () => {
			setTimeout(() => {
				this.setState({
					enter: false,
				});
			}, timeout);
		});
	}


	buildPayButotn() {
		let {
			payEnabled,
		} = this.state;

		if (payEnabled) {
			return (
				<div onClick={this.handlePay.bind(this)} className="btn btn-pay">
					立即支付
				</div>
			)
		} else {
			return (
				<div className="btn disabled">
					立即支付
				</div>
			)
		}
	}

	handleSelfPickedListConfirm(index) {
		this.setState({
			isSelfPickedListActive: false,
		}, () => {
			this.handleSelfPickupCheck(index);
		});
	}

	handleSelfPickupCheck(index) {
		let {shopList} = this.state;
		let clonedShopList = Util.deepClone(shopList);
		let currentShop = clonedShopList[0];
		currentShop.deliveryInfo.selected = index;

		this.setState({
			shopList: clonedShopList,
		}); 
	}

	render () {
		let {
			address: {
				name,
				tel,
				phone,
				addressId,
				addressString,
			},
			isOldOrder,
			isSelfPickedListActive,
			shopList,
			totalPrice,
			postage,
			currentDeliveryType,
			invoice: {
				checked,
				type,
				invoiceTitle,
			},
			protocol,
		} = this.state;

		let totalPriceFixed2 = new Number(totalPrice).toFixed(2);
		let totalSplits = totalPriceFixed2.split('.');
		let total = totalSplits[0];
		let fixed = totalSplits[1];
		let protocolChecked = protocol.checked;
		let payButton = this.buildPayButotn();
		let selfPickupList = shopList.length ? 
							 shopList[0].deliveryInfo.deliveryAddressList :
							 [];
		let addressDetail = Util.isExisty(addressId) ? (
				<div className="address-detail">
					<div className="address-basic">
						<span>{name}</span>
						<span className="tel">{tel}</span>
						<span>{phone}</span>
					</div>
					<div className="address-spec">
						{addressString}
					</div>
				</div>
			) : (
				<div className="">请先选择收货地址</div>
			);


		return (
			<div className="m-confirmorder">
				<div onClick={this.handleAddressClick.bind(this)} className="m-header">
					<div className="address-info">
						<div className="icon-place">
							<div className="poi"></div>
						</div>
						{addressDetail}
						<div className="icon-arrow-right">
							<div className="arrow">
							</div>
						</div>
					</div>
				</div>
				<div className="m-body">
					<PayChannel 
						payChannel={0}
						onPayChannelChange={this.handlePayChangeClick.bind(this)}
					/>
					<Invoice 
						isOldOrder={isOldOrder}
						invoiceType={type}
						onInvoiceChange={this.handleInvoiceChange.bind(this)}
						onInvoiceTypeChange={this.handleInvoiceTypeChange.bind(this)}
						invoiceChecked={checked}
						invoiceTitle={invoiceTitle}
						onInvoiceTitleChange={this.handleInvoiceTitleChange.bind(this)}
					/>
					<OrderShopList
						isOldOrder={isOldOrder}
						deliveryType={currentDeliveryType}
						handleDeliveryTypeChange={this.handleDeliveryTypeChange.bind(this)}
						shopList={shopList}
						handlePickedDetailClick={this.handlePickedDetailClick.bind(this)}
					/>
					<Protocol
						checked={protocolChecked}
						onProtocolChange={this.handleProtocolChange.bind(this)}
					/>
				</div>
				<SelfPickedList 
				    isOldOrder={this.state.isOldOrder}
					selected={0}
					active={isSelfPickedListActive}
					list={selfPickupList}
					handleSelfPickedListConfirm={this.handleSelfPickedListConfirm.bind(this)}
				/>
				<div className="m-footer">
					<div className="m-pay">
						<div className="pay-info">
							<div className="total">
								合计
								<span className="total-price">
									￥
									<b>{total}</b>
									.
									<i>{fixed}</i>
								</span>
							</div>
							<div className="postage">
								含运费
								<span className="postage-price">
									￥
									<b>{postage}</b>
								</span>
							</div>
						</div>
						{payButton}
					</div>
				</div>

				<Notification 
					enter={this.state.enter} 
					leave={this.leave.bind(this)}
				>
					{this.state.message}
				</Notification>
			</div>
		)
	}
}

/**
 * [EmptyAddress 地址构造类]
 * @Author   JohnNong
 * @Email    overkazaf@gmail.com
 * @Github   https://github.com/overkazaf
 * @DateTime 2016-12-05T11:33:43+0800
 */
class Address {
	constructor({addressId, name, tel, phone, addressString}) {
		this.addressId = addressId;
		this.name = name;
		this.tel = tel;
		this.phone = phone;
		this.addressString = addressString;
	}
}


function doRender () {
	ReactDOM.render(<MyComponent /> , document.getElementById("app"));
}

setTimeout(doRender, 16);