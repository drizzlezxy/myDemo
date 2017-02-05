import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import Util from "extend/common/util";
import RequestUtil from "extend/common/RequestUtil";
import WeixinUtil from "extend/common/WeixinUtil";
import Tab from 'components/Tab/Tab';
import List from 'components/List/list'
import CacheController from 'extend/cache/CacheController';
import Notification from 'components/Notification/Notification.jsx'
import Slider from 'components/Slide/Slider.jsx'
import 'scss/base.scss';
import 'scss/PrdtList/index.scss';

class MyComponent extends Component {
	constructor (props) {
		super(props);

		this.state = {
			tabTree: {
				activeIndex : 0,
				items: []
			},
			currentTabItems: [], // 存放当前展示的tab对象，后期做滚动加载
			currentSortIndex: 0,
			enter: false,  //提示信息显示
			message: null,  //提示信息显示内容
		};
	}

	componentDidMount () {
		WeixinUtil.hideWeixinMenu();

		const that = this;
		let param = {
			url : `item/getCategoryOfShop`,
			method : 'GET',
			data: {
				shopId: 590
			},
			successFn : function (result) {
                if (RequestUtil.isResultSuccessful(result)) {              	
                    that.initTabItems(result.result);

                }else{
					that.setErrorMessage({message: result.message});
                }
			},
			errorFn : function () {
				that.setErrorMessage({message: "获取商品信息失败，请稍后再试"});
			}
		};

		return RequestUtil.fetch(param);
	}

	
	initTabItems(tabItems) {
		this.setTabItems(this.getTabItems(tabItems));
	}

	getTabItems(tabItems) {
		return tabItems.map((item, index) => {
			let subTabs = Util.isExisty(item.categoryDTOList) ? item.categoryDTOList.map( subitem => {
				return {
					label: subitem.name,
					status: subitem.id,
				}
			}) : null;
			return {
				label: item.name,
				status: item.id,
				display: true,
				items: subTabs,
			}
		});
	}

	setTabItems(tabItems) {
		let tabTree = {
						activeIndex : 0,
						items: tabItems,
					};

		let currentTabItems = tabItems[0].length ? 
							  this.getCurrentTabEmptyArray(tabItems[0].items) :
							  [];
				
		this.setState({
			tabTree,
			currentTabItems,
		}, () => {
			this.setSubPrdtList(0, 0);
			
			this.refs['topTab'].init(0);	// 修正子tab的bar位移及长度
		});
	};

	getCurrentTabEmptyArray(tabItems) {
		return new Array(tabItems.length);
	}

	// 设置二级菜单下的商品列表
	setSubPrdtList(topIndex = 0, subIndex = 0) {
		let that = this;
		let currentState = that.state;
		let {items: tabTree} = currentState.tabTree;

		let currentTopTab = tabTree[topIndex];
	    let topTabId = currentTopTab.status;

	    let subTabs = currentTopTab.items;
	    let subTabId = that.hasSortTab(currentTopTab) ? subTabs[subIndex].status : null;

		const cacheKey = `PrdtList_${topTabId}_${subTabId}`;

		document.title = currentTopTab.label;

		let execSetSubPrdtList = () => {
			let clonedCurrentTabItems = Util.deepClone(currentState.currentTabItems);

			let prdtListData = CacheController.getFromCache(cacheKey);
			if(that.hasSortTab(currentTopTab)) {
				clonedCurrentTabItems[subIndex] = prdtListData;
			} else {
				clonedCurrentTabItems[0] = prdtListData;
			}

			that.setState({
				currentTabItems: clonedCurrentTabItems,
			});
		};

		if (!CacheController.isInCache(cacheKey)) {
			return that.resetPrdtListData({
				requestId: subTabId || topTabId,
			}, (data) => {
				CacheController.storeInCache(cacheKey, that.proccessPrdtListData(data));

				execSetSubPrdtList();
			});
		}
		
		execSetSubPrdtList();
	}

	hasSortTab(currentTopTab) {
		return Util.isExisty(currentTopTab.items);
	}

	// 处理商品列表的数据，这里只需要简单返回，如果有适配处理也统一在这进行
	proccessPrdtListData(data ) {
		let prdtList = !!data && data.prdtList;
		return prdtList;
	}

	// 重置二级菜单下的商品列表
	resetPrdtListData(options = {}, callback) {
		return this.getPrdtListData(options, (data) => {
			callback && callback(data);
		});
	}

	// 获取二级菜单下的商品列表数据
	getPrdtListData(options = {}, callback) {
		let {
				requestId,
				shopId = 590,
				sortType = 0,
				fromId = 0,
			} = options;
		let param = {
			url: `item/getShopPrdtList`,
			data: {
				categoryId: requestId,
				shopId,
				sortType,
				fromId,
			},
			method: 'GET',
			successFn: (data) => {
	            if (RequestUtil.isResultSuccessful(data)) {      	
	                callback && callback(data.result);
	    		}else{
					this.setErrorMessage({message: data.message});
	    		}
			},
		 	errorFn: () => {
		 		this.setErrorMessage({message: "获取商品信息失败"});
		 	},
		};

		RequestUtil.fetch(param);
	}

	handleTabChange(item, index) {
		let ctx = this.context;
		let clonedTabTree = Util.deepClone(ctx.state.tabTree);

		clonedTabTree.activeIndex = index;

		let topTab = clonedTabTree.items[index];
		let currentTabItems = ctx.hasSortTab(topTab) ? 
							  ctx.getCurrentTabEmptyArray(topTab.items) :
							  [];

		ctx.setState({
			tabTree : clonedTabTree,
			currentTabItems,
			currentSortIndex: 0
		}, () => ctx.setSubPrdtList(index, 0)
		);
	}

	setSortIndex(index) {
		this.setState({
			currentSortIndex: index,
		});
		this.setSubPrdtList(this.state.tabTree.activeIndex, index);
	}

  /**
   * 设置提示信息并显示
   * @param {[Object]} data [{message："提示信息"}]
   */
  setErrorMessage(data) {
    let message = data&&data.message || "获取商品信息失败"
    this.setState({
      message: message,
      submitStatus: 0
    }, function () {
      this.enter();
    }.bind(this))
  }

  /**
   * 提示组件Notification消失
   * @return {[type]} [description]
   */
  leave() {
    this.setState({
      enter: false
    });
  }

  /**
   * 提示组件Notification出现，2s后自动消失
   * @return {[type]} [description]
   */
  enter() {
    this.setState({
      enter: true
    });
    setTimeout(function () {
      this.leave()
    }.bind(this), 2000)
  }

	render () {
		const that = this;
		let {tabTree, currentTabItems} = this.state;
		let tabActiveIndex = tabTree.activeIndex;
		let tabItems = tabTree.items;

		let tabStatus = tabItems.map(function (item, index){
			return item.label;
		}).filter(function (item) {
			return !item.display;
		});

		let activeTab = tabTree.items[tabActiveIndex];
		let isShowSortTab = () => {
			return Util.isExisty(activeTab) && Util.isArray(activeTab.items) && (activeTab.items.length > 1)
		}
		let sortTabs =  isShowSortTab() && activeTab.items.map( (item,index) => {
			let activeSortTab = that.state.currentSortIndex == index ? ' active' : '';
			return (
				<div className={"tab-item" + activeSortTab} 
					onClick={that.setSortIndex.bind(that,index)} 
					key={index}>
						{item.label}
				</div>
			)
		});

		return (
			<div className="m-prdtlist">
				<div className="m-header">
					<Tab ref='topTab'
						tabs={tabStatus} 
						activeIndex={tabActiveIndex}
						context={that}
						handleItemClick={this.handleTabChange}
					/>
					<div className="sort-tabs">{sortTabs}</div>
				</div>
				<div className="m-body">
					<Slider itemList={this.state.currentTabItems} setShowIndex={that.setSortIndex.bind(this)} showIndex={that.state.currentSortIndex}>
						<List/>
					</Slider>
				</div>
				<div className="m-footer"></div>
				<Notification enter={this.state.enter} leave={this.leave.bind(this)}>{this.state.message}</Notification>
			</div>
		)
	}
}


function doRender () {
	ReactDOM.render(<MyComponent /> , document.getElementById("app"));
}

setTimeout(doRender, 16);