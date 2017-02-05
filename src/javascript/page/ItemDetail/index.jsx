import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import Util from "extend/common/util";
import RequestUtil from "extend/common/RequestUtil";
import WeixinUtil from "extend/common/WeixinUtil";
import LoginUtil from "extend/login/loginUtil";
import RedirectUtil from "extend/common/RedirectUtil";
import Logger from "extend/common/Logger";
import ItemDetailTopBar from "components/ItemDetail/ItemDetailTopBar";
import ItemDetailHeader from "components/ItemDetail/ItemDetailHeader";
import ItemInfo from "components/ItemDetail/ItemInfo";
import ItemDetailBody from "components/ItemDetail/ItemDetailBody";
import ItemDetailFooter from "components/ItemDetail/ItemDetailFooter";
import ItemAdaptor from 'extend/adaptor/ItemAdaptor';
import itemDetailState from 'states/ItemDetailState';
import SkuAlgorithm from "extend/algorithm/SkuAlgorithm";
import HistoryUtil from "extend/common/HistoryUtil";
import Notification from 'components/Notification/Notification';
import 'scss/base.scss';
import 'scss/ItemDetail/index.scss';

import CONSTANTS from 'constants/constants.json';

class MyComponent extends Component {
	constructor (props) {
		super(props);

		let defaultState = itemDetailState;
		defaultState.phoneBinded = true;

		this.state = defaultState;

		this.initLogin();
	}


	initLogin() {
		let that = this;
		let appInfo = {
			env: 'WX',
		};

		let extraParam = {
			pageId: 'ItemDetail',
			queryObj: Util.parseQueryString(location.href),
			options: {},
		};

		LoginUtil.login({
			appInfo,
			extraParam,
		}, that.authCallback.bind(that));
	}

	authCallback(userMsg, gotStatus) {

		const {gotError, gotInfoWrong, gotNotBinded, gotInfo} = LoginUtil.loginResultStatus;
		switch(gotStatus) {
			case gotError: 
			case gotInfoWrong:
				break;

			case gotNotBinded:
				this.setState({phoneBinded: false});
				// LoginUtil.toBindPhone();
				break;

			case gotInfo:
				// this.setUserInfo(userMsg);
				break;

			default:
				break;
		}
	}

	initParamStatus(paramId) {
		this.resetBlockIndexList(paramId, -1);
	}

	getCartStatus() {
		let cartStatusParam = {
			url: 'cart/getCartStatus',
			data: {
				userId: Util.fetchUserId(),
				uid: Util.fetchUid(),
			},
			successFn: (data) => {
				if (RequestUtil.isResultSuccessful(data)) {
					let result = data.result;
					this.setState({
						cartCount: result.prdtCount,
					});
				} else {
					this.showNotification(CONSTANTS.MSG.CART.GET_CART_STATUS_FAILED);
				}
				
			},
			errorFn: (...args) => {
				Logger.error(...args);
			}
		};

		RequestUtil.fetch(cartStatusParam);
	}

	handleParam(paramId, paramIndex) {

		let {
			selectedKeyMap,
		} = this.state;

		let clonedKeyMap = Util.deepClone(selectedKeyMap);
		clonedKeyMap[paramId] = paramIndex;

		this.setState({
			selectedKeyMap: clonedKeyMap,
		}, () => {
			this.resetBlockIndexList(paramId, paramIndex);
		});
	}

	/**
	 * [resetBlockIndexList 每一次选择销售属性，都要重置销售属性中选项的block状态，这块丢给SkuAlgorithm算法模块去处理]
	 * @Author   JohnNong
	 * @Email    overkazaf@gmail.com
	 * @Github   https://github.com/overkazaf
	 * @DateTime 2016-11-26T14:12:45+0800
	 * @param    {[type]}                     paramId    [description]
	 * @param    {[type]}                     paramIndex [description]
	 * @return   {[type]}                                [description]
	 */
	resetBlockIndexList(paramId, paramIndex) {
		let {
			paramList,
			skuList,
			selectedKeyMap,
			basic,
		} = this.state;

		let newBasic = Util.deepClone(basic);
		let keys = {}; // 可选的销售属性
		let selectedKeys = []; // 选中的销售属性id
		paramList.map((param) => {
			let list = param.list.map((p) => {
				return p.id;
			});

			// 以paramId作为键值，对应一个选项列表
			keys[`${param.id}`] = list;

			if (typeof selectedKeyMap[`${param.id}`] !== 'undefined') {
				let selectedKey = list[selectedKeyMap[`${param.id}`]];

				// key存在时才push
				selectedKey && selectedKeys.push(selectedKey);
			}
		});

		let skus = skuList.map((skuItem) => {
			return {
				id: skuItem.id,
				spec: skuItem.spec,
				sku: skuItem.sku,
				count: skuItem.count,
				status: skuItem.status,
				payPrice: skuItem.payPrice,
				originPrice: skuItem.originPrice,
			};
		});

		let blockIndexListMap = SkuAlgorithm.getBlockIndexListMap(selectedKeys, keys, skus);
		let validSkuList = SkuAlgorithm.getFilteredSkus(selectedKeys, keys, skus);

		// reset paramList's blockIndexList
		for (let key in blockIndexListMap) {
			let newBlockIndexList = [];
			let blockIdList = blockIndexListMap[key];
			let currentParam = paramList.filter((param) => {
					return param.id == key;
				});
			let currentList = Util.flatten(
				currentParam.map((param) => {
					return param.list.map((item, index) => {
						return item.id;
					});
				})
			);

			blockIdList.map((id, index) => {
				let blockFlag = currentList.includes(id);
				if (blockFlag) {
					newBlockIndexList.push(currentList.indexOf(id));
				}
			});

			// 更新当前key值对应的blockIndexList
			if (currentParam.length) {
				currentParam[0].blockIndexList = newBlockIndexList;
			}
		}

		// 没有blockIndexList的话重置blockIndexList为空
		if(!Object.keys(blockIndexListMap).length) {
			paramList.map((param, index) => {
				paramList[index].blockIndexList = [];
			});
		}

		let selectedSkuId = null;
		let selectedSkuCount = -1;
		if (validSkuList.length) {
			let validSku = validSkuList[0];
			[
				newBasic.id,
				newBasic.prdtId,
				newBasic.payPrice,
				newBasic.originPrice,
			] = [validSku.id, validSku.prdtId, validSku.payPrice, validSku.originPrice];
 	
 			// Logger.log('this.isSkuSelected()', this.isSkuSelected());

			if (this.isSkuSelected()) {
				selectedSkuId = validSku.id;
				selectedSkuCount = validSku.count;
			}
		}

		this.setState({
			paramList: paramList,
			basic: newBasic,
			selectedSkuId: selectedSkuId,
			selectedSkuCount: selectedSkuCount,
		}, () => {
			//Logger.log('selectedSkuCount', selectedSkuCount);
			//Logger.log('selectedSkuId', selectedSkuId);
		});
	}

	/**
	 * [isSkuSelected 判断是否选中了可选的sku]
	 * @Author   JohnNong
	 * @Email    overkazaf@gmail.com
	 * @Github   https://github.com/overkazaf
	 * @DateTime 2016-11-26T13:59:24+0800
	 * @return   {Boolean}                    [description]
	 */
	isSkuSelected() {
		let {
			selectedKeyMap,
			skuList,
		} = this.state;

		if (skuList.length) {
			// 如果存在合法的sku列表，判断sku长度是否为选中的keyMap中值为有效数组下标的长度
			return skuList[0].sku.split('|').length === Object.keys(selectedKeyMap).filter((key) => {
				return selectedKeyMap[key] >= 0;
			}).length;
		}

		return false;
	}

	componentDidMount() {
		WeixinUtil.hideWeixinMenu();

		let prdtId = Util.fetchValueByCurrentURL('prdtId');
		let that = this;
		let param = {
			url: 'item/getPrdtDetail',
			data: {
				prdtId: prdtId,
			},
			successFn: function(data) {
				Logger.log(`request item/getPrdtDetail prdtId=${prdtId} successful`);

				if (RequestUtil.isResultSuccessful(data)) {
					let itemAdaptor = new ItemAdaptor(data.result);
					let newState = Util.deepClone(that.state);
					let newData = itemAdaptor.getData();

					[
						newState.paramList,
						newState.basic,
						newState.imageList,
						newState.detailList,
						newState.skuList,
						newState.status,
					] = [newData.paramList, newData.basic, newData.imageList, newData.detailList, newData.skuList, newData.status];

					that.setState(newState, () => {
						if (newState.paramList.length) {
							that.initParamStatus(newState.paramList[0].id);
						}

						that.getCartStatus();
					});

					WeixinUtil.shareByRemoteOption({
						targetLink: {
							pageName: 'ItemDetail',
							options: {prdtId: prdtId,},
						}, 
						successFn: () => {}, 
						cancelFn: () => {},
						data: {
							skuId: that.getCheapestSku(newState.skuList),
							type: 1,
						}, 
					});

				} else {
					Logger.error('error in getPrdtDetail');
				}
			},
			errorFn: function(...args) {
				Logger.error(`request item/getPrdtDetail prdtId=${prdtId} error`);
			}
		};
		RequestUtil.fetch(param);
	}

	getCheapestSku(skuList) {
		let cheapestSkuId = skuList[0].id;
		let CheapestPrice = skuList[0].payPrice;

		skuList.map( (item, index) => {
			(item.payPrice < CheapestPrice) && (cheapestSkuId = item.id)
		})
		return cheapestSkuId;
	}

	handleRefresh(resolve, reject) {
		Logger.log('avi');
	}

	handleAdd2Cart(n) {

		if(this.state.phoneBinded) {
			this.setState({
				currentCount: n,
			}, () => {
				if (this.validateCurrentState()) {
					// this.showNotification('正在添加sku到购物车中...');
					this.doAddCart();
				}
			});
		} else {
			LoginUtil.toBindPhone();
		}
	}

	doAddCart() {
		let {
			selectedSkuId,
			currentCount,
		} = this.state;

		let addCartParam = {
			url: 'cart/addCart',
			data: {
				userId: Util.fetchUserId(),
				uid: Util.fetchUid(),
				skuId: selectedSkuId,
				count: currentCount,
			},
			successFn: (data) => {
				if (RequestUtil.isResultSuccessful(data)) {
					let result = data.result;
					this.setState({
						cartCount: result.prdtCount,
					}, () => {
						this.showNotification(CONSTANTS.MSG.CART.ADD_CART_SUCCESS);
					});
				} else {
					this.showNotification(data.message);
				}
			},
			errorFn: (data) => {

			}
		};

		RequestUtil.fetch(addCartParam);
	}

	handleDirectBuy(n) {

		if(this.state.phoneBinded) {
			this.setState({
				currentCount: n,
			}, () => {
				if (this.validateCurrentState()) {
					let {
						selectedSkuId,
						currentCount,
					} = this.state;

					let options = Object.assign(Util.parseQueryString(location.href), {
						skuId: selectedSkuId,
						skuCount: currentCount,
					});
					this.doDirectBuy(options);
				}
			});
		} else {
			LoginUtil.toBindPhone();
		}
	}

	/**
	 * [doDirectBuy 补全参数，跳转页面到订单确认页]
	 * @Author   JohnNong
	 * @Email    overkazaf@gmail.com
	 * @Github   https://github.com/overkazaf
	 * @DateTime 2016-12-03T13:50:49+0800
	 * @param    {[type]}                     options [description]
	 * @return   {[type]}                             [description]
	 */
	doDirectBuy(options) {
		RedirectUtil.redirectPage({
			pageName: 'ConfirmOrder',
			options: options,
		});
	}

	validateCurrentState() {
		let {
			selectedSkuCount,
			currentCount,
			selectedSkuId,
		} = this.state;

		if (selectedSkuCount === -1) {
			this.showNotification(CONSTANTS.MSG.ITEM.SKU_INVALID);
		} else {
			if (currentCount > selectedSkuCount) {
				this.showNotification(CONSTANTS.MSG.ITEM.SKU_INSUFFICIENT);
			} else {
				return true;
			}
		}

		return false;
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

	handleCartClick() {
		let currentQueryObj = Util.parseQueryString(location.href);
		RedirectUtil.redirectPage({
			pageName: 'Cart',
			options: Object.assign(currentQueryObj, {
				
			}),
		});
	}

	handleBackClick() {
		HistoryUtil.goBack();
	}

	render () {
		let {
			footer,
			imageList,
			paramList,
			basic,
			detailList,
			cartCount,
			memberList,
			selectedSkuCount,
			status,
		} = this.state;

		return (
			<div className="m-itemdetail">
				
			    <ItemDetailTopBar 
			    	cartClick={this.handleCartClick.bind(this)}
			    	backClick={this.handleBackClick.bind(this)}
					cartCount={cartCount}
				/>
				<div className="m-header">
					<ItemDetailHeader 
						imageList={imageList}
					/>
					<ItemInfo
						paramList={paramList}
						basic={basic}
						handleParam={this.handleParam.bind(this)}
						prdtStatus={status}
					/>
				</div>
				<div className="m-body">
					<ItemDetailBody 
						detailList={detailList}
						memberList={memberList}
					/>
				</div>
				<div className="m-footer">
					<ItemDetailFooter 
						handleAdd2Cart={this.handleAdd2Cart.bind(this)}
						handleDirectBuy={this.handleDirectBuy.bind(this)}
						showNotification={this.showNotification.bind(this)}
						remainCount={selectedSkuCount}
						prdtStatus={status}
					/>
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


function doRender () {
	ReactDOM.render(<MyComponent /> , document.getElementById("app"));
}

setTimeout(doRender, 16);