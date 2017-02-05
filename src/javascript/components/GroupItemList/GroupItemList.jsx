import React, {Component} from 'react';
import GroupItem from 'components/GroupItem/GroupItem';
import BaseList from 'components/BaseList/BaseList';
import Util from 'extend/common/util';
import './GroupItemList.scss';

export default 
class GroupItemList extends Component {
	constructor(props) {
	  super(props);
	
	  this.state = {
	  	itemList: props.data || [],
	  };
	}

	componentWillReceiveProps(nextProps) {
		if (Util.isExisty(nextProps.data)) {
			this.setState({
				itemList: nextProps.data,
			});
		}
	}

	handleClick(poSkuId, skuId, poSkuStatus, status) {
		this.props.handleClick && this.props.handleClick(poSkuId, skuId, poSkuStatus, status);
	}

	loadMore() {
		this.props.resetItemList && this.props.resetItemList();
	}

	render() {
		let that = this;
		let {itemList} = this.state;


		let itemListContent = itemList.map(function(item, index) {
			item.handleClick = that.handleClick.bind(that, item.poSkuId, item.skuId, item.poSkuStatus, item.status)
			item.groupItemKey = `${item.name}-${index}`;
			return item;
		});
		return (
				<BaseList clazz="m-group-item-list" items={itemListContent} 
					loadMore={this.loadMore.bind(this)}
					hasMore={this.props.hasMore}
				>
					<GroupItem />
	 			</BaseList>
		)
	}
}