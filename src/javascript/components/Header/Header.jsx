import React, {Component} from 'react'
import './Header.scss'

export default 
class Header extends Component {
	constructor (props) {
		super(props);
	}

	handleLeftBtnClick () {
		console.log('left clicked');
		
		this.props.handleLeftBtnClick && this.props.handleLeftBtnClick();
	}

	handleRightBtnClick () {
		console.log('right clicked');

		this.props.handleRightBtnClick && this.props.handleRightBtnClick();
	}

	render () {
		let opacityValue = this.props.bgOpacity || 1;
		let headerStyleObj = {
			opacity: opacityValue,
		};

		return (
			<header className="m-header" style={headerStyleObj}>
				<div onClick={this.handleLeftBtnClick.bind(this)} className="header-left-btn fa-angle-left"></div>
				<h1 className="title">{this.props.title}</h1>
				<div onClick={this.handleRightBtnClick.bind(this)} className="header-right-btn fa-angle-right"></div>
			</header>
		)
	}
}

