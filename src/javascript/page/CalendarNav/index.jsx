import React, {
	Component
} from 'react';
import ReactDOM from 'react-dom';
import Util from "extend/common/util";
import RequestUtil from "extend/common/RequestUtil";
import WeixinUtil from "extend/common/WeixinUtil";
import Hammer from 'extend/hammer.min.js';
import SlideUp from 'components/SlideUp/SlideUp';
import Hook from 'extend/common/Hook';
import 'scss/base.scss';
import 'scss/CalendarNav/index.scss';
import ReactPullToRefresh from 'react-pull-to-refresh';

class MyComponent extends Component {
	constructor(props) {
		super(props);

		let xinjiangItems = require('../../data/fruitsXinjiang.json');
		let yunnanItems = require('../../data/fruitsYunnan.json');
		let hainanItems = require('../../data/fruitsHainan.json');
		let dongsanshengItems = require('../../data/fruitsDongsansheng.json');

		let wholeItems = [
			Hook.hookAndAddPrefix(xinjiangItems, 'navItems'),
			Hook.hookAndAddPrefix(yunnanItems, 'navItems'),
			Hook.hookAndAddPrefix(hainanItems, 'navItems'),
			Hook.hookAndAddPrefix(dongsanshengItems, 'navItems'),
		];

		let bottomNavItems = {
			activeIndex: 0,
			navItems: [{
				id: 1,
				name: 'nav1',
				url: '',
				clazz: 'xinjiang',
				label: '寻味新疆',
			},
			{
				id: 2,
				name: 'nav2',
				url: '',
				clazz: 'yunnan',
				label: '丰饶云南',
			},
			{
				id: 3,
				name: 'nav3',
				url: '',
				clazz: 'hainan',
				label: '热岛海南',
			},
			{
				id: 4,
				name: 'nav4',
				url: '',
				clazz: 'dongsansheng',
				label: '黑土东北',
			}],
		};

		wholeItems.map(function(navItems) {
			return navItems.map(function(item) {
				if (item.swipeItems.length > 1) {
					item.swipeItems = item.swipeItems.concat(item.swipeItems);
				}
				return item;
			});
		});
		

		this.state = {
			reset: false,
			navItemActiveIndex: 0,
			navItems: wholeItems[0],
			wholeItems: wholeItems,
			animating: false,
			bottomNavItems: bottomNavItems,
		};

	}

	redirect(id) {
		let redirectTarget = Util.getUrlByPageName('CalendarPrdtDetail', {
			prdtId: id,
		});

		location.href = redirectTarget;
	}

	handleCalnavClick(index) {
		if(this.state.navItemActiveIndex == index) {
			return;
		}
		let clonedNavItems = Util.deepClone(this.state.navItems);
		clonedNavItems.map(function (item, index) {
			item.activeIndex = 0;
			return item;
		});

		this.setState({
			reset: true,
			navItemActiveIndex: index,
			navItems: clonedNavItems,
		}, () => {
			setTimeout(() => {
				this.setState({
					reset: false,
				});
			}, 300);
		});
	}

	handleSectionClick(index) {
		if(this.state.animating) return;
		let $swipe = this.refs['swipe'];
		let clonedNavItems = Util.deepClone(this.state.navItems);
		let current = clonedNavItems[this.state.navItemActiveIndex];

		current.activeIndex = index;

		if (current.swipeItems.length > 1 && index >= Math.floor(current.swipeItems.length/2)) {
			current.swipeItems = current.swipeItems.concat(Util.deepClone(current.swipeItems));
			current.cloneCount = current.cloneCount + 1;
		}

		this.setState({
			animating: true,
		}, () => {
			setTimeout(() => {
				this.setState({
					animating: false,
					navItems: clonedNavItems,
				});
			}, 200);
		});
	}

	getSwipeItemIndex(flag) {
		let {
			navItems,
			navItemActiveIndex,
		} = this.state;
		let current = navItems[navItemActiveIndex];
		let swipeItemActiveIndex = current.activeIndex;
		let currentSwipeItems = current.swipeItems;
		let that = this;
		let activeIndex;

		switch (flag) {
			case 'prev':
				activeIndex = swipeItemActiveIndex <= 0 ? 0 : swipeItemActiveIndex - 1;
				break;
			case 'next':
				activeIndex = swipeItemActiveIndex < currentSwipeItems.length - 1 ? swipeItemActiveIndex + 1 : currentSwipeItems.length - 1;
				break;
			default:
				activeIndex = swipeItemActiveIndex;
		}

		return activeIndex;
	}

	handleRefresh(resolve, reject) {
	  // do some async code here
	  if (this.state.animating) return;
	  let nextIndex = this.getSwipeItemIndex('prev');
	  if (1) {
	  	console.log('prev');
	    this.handleSectionClick(nextIndex);
	  } else {
	    reject();
	  }
	}

	/**
	 * [handleTabbarClick 这块相当于reset了tabbar状态]
	 * @Author   JohnNong
	 * @Email    overkazaf@gmail.com
	 * @Github   https://github.com/overkazaf
	 * @DateTime 2016-11-14T11:29:13+0800
	 * @param    {[type]}                     index [description]
	 * @return   {[type]}                           [description]
	 */
	handleTabbarClick(index) {
		let {
			navItems,
			bottomNavItems,
			wholeItems,
		} = this.state;

		if (bottomNavItems.activeIndex == index) return;

		// cache the old navItems
		wholeItems[bottomNavItems.activeIndex] = navItems;

		let clonedBottomNavItems = Util.deepClone(bottomNavItems);
		clonedBottomNavItems.activeIndex = index;

		let newNavItems = wholeItems[index];
		if (newNavItems.length) {
			newNavItems[0].activeIndex = 0;
		}

		this.setState({
			navItemActiveIndex: 0,
			navItems: newNavItems,
			bottomNavItems: clonedBottomNavItems,
		});
	}

	handleUpdateItemList(itemList) {
		let {
			navItems,
			navItemActiveIndex,
		} = this.state;
		if(!navItems.length) return;

		let clonedNavItems = Util.deepClone(navItems);
		let currentSwipe = clonedNavItems[navItemActiveIndex];
		currentSwipe.swipeItems = itemList;

		this.setState({
			navItems: clonedNavItems,
		});
	}

	toggleBlock(flag) {
		let {
			navItems,
			navItemActiveIndex,
		} = this.state;
		if(!navItems.length) return;

		if (flag == 'prev') {
			navItemActiveIndex =  navItemActiveIndex > 0 ? navItemActiveIndex - 1 : navItems.length - 1;
		} else if (flag == 'next') {
			navItemActiveIndex = navItemActiveIndex + 1 < navItems.length ? navItemActiveIndex + 1 : 0;
		}

		this.handleCalnavClick(navItemActiveIndex);
	}

	render() {
		let {
			reset,
			navItemActiveIndex,
			navItems,
			bottomNavItems,
		} = this.state;

		let that = this;
		let currentSwipe;
		let swipeItemActiveIndex;
		let swipeItems = [];
		
		if (navItems.length) {
			currentSwipe = navItems[navItemActiveIndex],
			swipeItemActiveIndex = currentSwipe.activeIndex,
			swipeItems = currentSwipe.swipeItems;
		}

		let calnavListItems = navItems.map(function(item, index) {
			let clazzName = index == navItemActiveIndex ? 'active calnav-list-item' : 'calnav-list-item';
			let navIndex = `${index}-${item.month}`;
			return ( 
				<li key={navIndex}
					onClick={that.handleCalnavClick.bind(that, index)}
					className={clazzName}>
					<div className="month">{item.month}</div> 
				</li>
			)
		});

		//let navMarginLeft = -0.65 * navItemActiveIndex;

		let navlistStyleObj = {
			width: `${navItems.length * 0.65}rem`,
		};

		let bottomNavActiveIndex = bottomNavItems.activeIndex;
		let tabBarItems = bottomNavItems.navItems;
		let bottomNavListContents = tabBarItems.map(function(item, index) {
			let isActive = index == bottomNavActiveIndex;
			let clazz = isActive ? item.clazz + ' active': item.clazz;
				clazz += ' tabbar-icon';

			let tabbarListItemClazz = isActive ? 'tabbar-list-item active' : 'tabbar-list-item';
			let labelClazz = `tabbar-text ${item.clazz}`;
			return (
				<li 
					key={index} 
					className={tabbarListItemClazz}
					onClick={that.handleTabbarClick.bind(that, index)}
					>
					<div className={clazz}></div>
					<div className={labelClazz}>
						{item.label}
					</div>
				</li>
			)
		});

		return (
			<div className="m-calendarnav">
				<div className="m-header">
					<ul className="calnav-list clearfix" style={navlistStyleObj}>
						{calnavListItems}
					</ul>
				</div>
				<div className="m-body" ref="swipe">
					  <SlideUp
						reset={reset}
					  	navItemActiveIndex={navItemActiveIndex}
					  	itemList={swipeItems}
					  	nextBlock={that.toggleBlock.bind(that, 'next')}
					  	previousBlock={that.toggleBlock.bind(that, 'prev')}
					  	updateItemList={that.handleUpdateItemList.bind(this)}
					  />
				</div>
				<div className="m-footer">
					<ul className="tabbar-list">
						{bottomNavListContents}
					</ul>
				</div>
			</div>
		)
	}
}


function doRender() {
	ReactDOM.render(<MyComponent />, document.getElementById("app"));
}

setTimeout(doRender, 16);