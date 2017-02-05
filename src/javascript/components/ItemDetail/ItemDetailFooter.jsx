import React, {Component} from 'react';
import Counter from 'components/Counter/Counter';
import Logger from 'extend/common/Logger';
import Util from "extend/common/util";
import './ItemDetailFooter.scss';

import CONSTANTS from 'constants/constants.json';

export default
class ItemDetailFooter extends Component {
	constructor(props) {
	  super(props);
	
	  this.state = {
	  	count: 1,
	  	remainCount: 99,
	  };
	}

	componentWillReceiveProps(nextProps) {
		let remainCount = nextProps.remainCount;
		let currentCount = this.state.count;
		if(!remainCount) return;

		let newState = {};
		if(remainCount == -1) {
			newState = {
				remainCount: 99,
			}
		} else {
			newState = {
				remainCount: remainCount > 99 ? 99 : remainCount,
			};

			if(currentCount > remainCount) {
				this.showNotification(CONSTANTS.MSG.ITEM.SKU_INSUFFICIENT);
				newState.count = remainCount;
			}
		}

		this.setState(newState);
	}

	showNotification(message) {
		this.props.showNotification(message);
	}

	handleNumberChange(n) {
		Logger.log('handler', n);
		this.setState({
			count: n,
		});
	}

	handleBtnClick(clickType) {
		switch(clickType) {
			case 'add':
				this.props.handleAdd2Cart && this.props.handleAdd2Cart(this.state.count);
				break;
			case 'buy':
				this.props.handleDirectBuy && this.props.handleDirectBuy(this.state.count);
				break;
		}
	}

	isPrdtOff(status) {
		return Util.isExisty(status) && status === 0;
	}

	render() {
		/*FIXME*/
		if(this.isPrdtOff(this.props.prdtStatus)) {
			return <div></div>
		}

		let cartClazz = 'btn btn-cart';
		let buyClazz = 'btn btn-buy';

		let {count: curVal, remainCount} = this.state;
		let notification = curVal >= 99 ? 
							CONSTANTS.MSG.ITEM.SKU_COUNTLIMIT :
							CONSTANTS.MSG.ITEM.SKU_INSUFFICIENT;

		return (
			<footer className="m-detailfooter">
				<div className="footer-counter">
					<Counter 
						minVal={1} 
						ref="cartCounter" 
						numChange={this.handleNumberChange.bind(this)}
						showNotification={this.showNotification.bind(this, notification)} 
						maxVal={remainCount} 
						curVal={curVal}
					/>
				</div>
				<div className="footer-btn-group">
					<div onClick={this.handleBtnClick.bind(this, 'add')} className={cartClazz}>放入购物篮</div>
					<div onClick={this.handleBtnClick.bind(this, 'buy')} className={buyClazz}>立即购买</div>
				</div>
			</footer>
		)
	}
}