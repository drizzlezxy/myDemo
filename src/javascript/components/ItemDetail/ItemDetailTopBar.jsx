import React, {Component} from 'react';
import Util from 'extend/common/util';
import './ItemDetailTopBar.scss';

export default
class ItemDetailTopBar extends Component {
	constructor(props) {
	  super(props);
	
	  this.state = {
	  	cartCount: props.cartCount,
	  };
	}

	handleCartClick() {
		this.props.cartClick && this.props.cartClick();
	}

	handleBackClick() {
		this.props.backClick && this.props.backClick();
	}

	componentWillReceiveProps(nextProps) {
		if (Util.isExisty(nextProps.cartCount)) {
			this.setState({
				cartCount: nextProps.cartCount,
			});
		}
	}

	getCartCountContent(cartCount) {
		let cartContent = null;
		if (cartCount > 0) {
			if (cartCount < 99) {
				cartContent = (<div className="count">{cartCount}</div>);
			} else {
				cartContent = (<div className="count">...</div>);
			}
		}

		return cartContent;
	}

	render() {
		let cartContent = this.getCartCountContent(this.state.cartCount);
		return (
			<div className="m-topbar">
				<div className="m-ctrl-bar">
					<div
					 	onClick={this.handleBackClick.bind(this)}
					 	className="back">
					 </div>
					<div 
						onClick={this.handleCartClick.bind(this)} className="cart">
						{cartContent}
					</div>
				</div>
			</div>
		)
	}
}