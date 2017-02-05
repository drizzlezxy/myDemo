import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import Util from "extend/common/util";
import RequestUtil from "extend/common/RequestUtil";
import RedirectUtil from "extend/common/RedirectUtil";
import ItemDetailHeader from "components/ItemDetail/ItemDetailHeader";
import ItemInfo from "components/ItemDetail/ItemInfo";
import YQGroupItemDetailBody from "components/YQGroupItemDetail/YQGroupItemDetailBody";
import GroupItemDetailFooter from "components/GroupItemDetail/GroupItemDetailFooter";
import Notification from "components/Notification/Notification";
import GroupItemDetailState from 'states/GroupItemDetailState';
import GroupItemAdaptor from 'extend/adaptor/GroupItemAdaptor';
import SkuAlgorithm from 'extend/algorithm/SkuAlgorithm';
import Logger from "extend/common/Logger";
import 'scss/base.scss';
import 'scss/GroupItemDetail/index.scss';

export default
class YQGroupItemDetail extends Component {
	constructor (props) {
		super(props);

		let defaultState = GroupItemDetailState;
		this.state = defaultState;
	}

	initParamStatus(paramId) {
		this.resetBlockIndexList(paramId, -1);
	}

	componentDidMount() {
		let prdtId = Util.fetchValueByCurrentURL('poSkuId');
		let that = this;
		let param = {
			url: 'posku/content',
			data: {
				poSkuId: prdtId,
			},
			successFn: function(data) {
				if (RequestUtil.isResultSuccessful(data)) {
					that.props.setPoStatus(data.result.poStatus);

					let groupItemAdaptor = new GroupItemAdaptor(data.result);
					let newState = Util.deepClone(that.state);
					let newData = groupItemAdaptor.getData();

					[
						newState.paramList,
						newState.basic,
						newState.imageList,
						newState.detailList,
						newState.skuList,
						newState.footer,
					] = [newData.paramList, newData.basic, newData.imageList, newData.detailList, newData.skuList, newData.footer];

					that.setState(newState, () => {
						if (newState.paramList.length) {
							that.initParamStatus(newState.paramList[0].id);
						}
					});

				} else {
					Logger.error('error in getPrdtDetail');
				}
			},
			errorFn: function(...args) {
				Logger.error(`request item/getPrdtDetail prdtId=${prdtId} error`);
			}
		};
		RequestUtil.fetchYQ(param);
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
				// newBasic.payPrice,
				// newBasic.originPrice,
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

	render () {
		let {
			footer,
			imageList,
			detailList,
			memberList,
			skuList,
			basic,
			cartCount,
			paramList,
		} = this.state;

		return (
			<div className="m-groupitemdetail">
				<div className="m-header">
					<ItemDetailHeader 
						imageList={imageList}
					/>
					<ItemInfo
						paramList={[]}
						basic={basic}
						handleParam={this.handleParam.bind(this)}
					/>
				</div>
				<div className="m-body">
					<YQGroupItemDetailBody 
						detailList={detailList}
						memberList={memberList}
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