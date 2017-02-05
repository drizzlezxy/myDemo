import Util from 'extend/common/util';
export default class SkuAlgorithm {
	static getBlockIndexListMap(selectedKeys, keys, skus) {
		let ret = {};
		// step1. 根据选中的keys， 确定未选的还有哪些不可选
		let filteredSkus = SkuAlgorithm.getFilteredSkus(selectedKeys, keys, skus);

		if (!filteredSkus.length) {
			// 没有可选的sku，把所有的待选项置为block状态
			for (let key in keys) {
				let list = keys[key];
				ret[key] = SkuAlgorithm.getDiffSet(list, selectedKeys);
			}
			return ret;
		} else {
			// 存在可选的sku
			let {
				remainedKeysMap,
				selectedKeyMap,
			} = SkuAlgorithm.filterKeyMap(selectedKeys, keys);
			
			// 1. 未选的属性不在filteredSkus中， 就标记为block
			for (let key in remainedKeysMap) {
				let picked = [];
				let remainedIdList = remainedKeysMap[key];
				let blockIdList = [];

				filteredSkus.map((skuItem) => {
					let splitSkus = skuItem.sku.split('|').map((item) => {return parseInt(item, 10)});
					// 尝试剩余的id列表是否能组合成sku，如果可以，给出可以组合的id下标
					let containIndexList = SkuAlgorithm.listContains(remainedIdList, splitSkus);
					if (containIndexList.length) {
						picked = picked.concat(containIndexList);
					}

					blockIdList = remainedIdList.filter((remainedId, index) => {
						// 加入不能组合的下标
						return !picked.includes(index);
					});

				});

				ret[key] = blockIdList;
			}
			
			// 2. 选中的属性， 分别做尝试，如果变化一个不能和其它的构成有效组合，则标记成block
			for (let key in selectedKeyMap) {
				let picked = [];
				let selectedIdList = selectedKeyMap[key];
				let blockIdList = [];

				let testIdList = SkuAlgorithm.getDiffSet(selectedIdList, selectedKeys);
				if (testIdList.length) {
					// 尝试组合
					testIdList.map((paramId) => {
						let testKeys = SkuAlgorithm.replaceKey4Testing(selectedKeys, keys, paramId);
						let testSkuList = SkuAlgorithm.getFilteredSkus(testKeys, keys, skus);
						if (!testSkuList.length) {
							// 如果没有可以组合的情况，把这个id给排除掉
							blockIdList.push(paramId);
						}
					});
				}

				ret[key] = blockIdList;
			}

		}
		
		return ret;
	}

	/**
	 * [replaceKey4Testing 为了尝试新的组合是否能构成有效的sku，替换掉当前的选项id，返回新的数组]
	 * @Author   JohnNong
	 * @Email    overkazaf@gmail.com
	 * @Github   https://github.com/overkazaf
	 * @DateTime 2016-11-26T13:44:21+0800
	 * @param    {[type]}                     selectedKeys [description]
	 * @param    {[type]}                     keys         [description]
	 * @param    {[type]}                     paramId      [description]
	 * @return   {[type]}                                  [description]
	 */
	static replaceKey4Testing(selectedKeys, keys, paramId) {
		let target = Util.deepClone(selectedKeys);

		return target.map((id, index) => {
			if (SkuAlgorithm.isInsideSampList(id, paramId, keys)) {
				return paramId;
			}

			return id;
		});
	}

	static isInsideSampList(idA, idB, keys) {
		let flag = false;

		for (let key in keys) {
			let list = keys[key];
			if (list.includes(idA) && list.includes(idB)) {
				flag = true;
				break;
			}
		}

		return flag;
	}

	/**
	 * [filterKeyMap 根据选中的key分别筛选出已选和未选的key-map]
	 * @Author   JohnNong
	 * @Email    overkazaf@gmail.com
	 * @Github   https://github.com/overkazaf
	 * @DateTime 2016-11-25T16:47:31+0800
	 * @param    {[type]}                     selectedKeys [description]
	 * @param    {[type]}                     keys         [description]
	 * @return   {[type]}                                  [description]
	 */
	static filterKeyMap(selectedKeys, keys) {
		let remainedKeysMap = {}; // 剩下的可选keys Map
		let selectedKeyMap = {}; // 已选的keys Map
		for (let key in keys) {
			let list = keys[key];
			if (!SkuAlgorithm.getInterSet(list, selectedKeys).length) {
				remainedKeysMap[(`${key}`)] = [...list];
			} else {
				selectedKeyMap[(`${key}`)] = [...list];
			}
		}

		return {
			remainedKeysMap,
			selectedKeyMap,
		};
	}

	static listContains(list1, list2) {
		let ret = [];
		list1.map((item, index) => {
			let idx = list2.indexOf(item);
			if (idx !== -1) {
				ret.push(index);
			}
		});

		return ret;
	}

	/**
	 * [getInterSet 获取两个集合的交集]
	 * @Author   JohnNong
	 * @Email    overkazaf@gmail.com
	 * @Github   https://github.com/overkazaf
	 * @DateTime 2016-11-25T11:43:35+0800
	 * @param    {[type]}                     set1 [description]
	 * @param    {[type]}                     set2 [description]
	 * @return   {[type]}                          [description]
	 */
	static getInterSet(set1, set2) {
		let ret = [];
		set1.map((item) => {
			if(set2.includes(item)) {
				ret.push(item);
			}
		});
		return ret;
	}

	/**
	 * [getDiffSet 在set1中排除set2已经存在的元素]
	 * @Author   JohnNong
	 * @Email    overkazaf@gmail.com
	 * @Github   https://github.com/overkazaf
	 * @DateTime 2016-11-25T11:26:57+0800
	 * @param    {[type]}                     set1 [description]
	 * @param    {[type]}                     set2 [description]
	 * @return   {[type]}                          [description]
	 */
	static getDiffSet(set1, set2) {
		let ret = [];

		set1.map((item) => {
			if (!set2.includes(item)) {
				ret.push(item);
			}
		});

		return ret;
	}

	/**
	 * [getFilteredSkus 根据目前选中的选项id数组，获取出合法的可选sku列表]
	 * @Author   JohnNong
	 * @Email    overkazaf@gmail.com
	 * @Github   https://github.com/overkazaf
	 * @DateTime 2016-11-26T13:45:58+0800
	 * @param    {[type]}                     selectedKeys [description]
	 * @param    {[type]}                     keys         [description]
	 * @param    {[type]}                     skus         [description]
	 * @return   {[type]}                                  [description]
	 */
	static getFilteredSkus(selectedKeys, keys, skus) {
		let filteredSkus = [];

		skus.filter((sku) => {
			// 可用的sku
			return sku.status == 1;
		}).map((skuItem) => {
			let validFlag = true;
			let skuSplits = skuItem.sku.split('|');

			selectedKeys.map((key) => {
				if (!validFlag) return;
				if (!skuSplits.includes(''+key)) {
					validFlag = false;
				}
			});

			if (validFlag) {
				filteredSkus.push(skuItem);
			}
			
		});

		return filteredSkus;
	}
}