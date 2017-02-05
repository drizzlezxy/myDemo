import React, {Component} from 'react';
import Footer from 'components/Footer/Footer';
import './GroupItemDetailFooter.scss';


export default
class GroupItemDetailFooter extends Component {
	constructor(props) {
	  super(props);
	
	  this.state = {};
	}

	handleClick(index) {
		this.props.handleClick && this.props.handleClick(index);
	}

	handleHomeClick() {
		location.href = '../HomePage/index.html';
	}

	render() {
		let that = this;
		let footerContent = this.props.data.map(function(item, index) {
			let footerClazz = index ? 'footer-item single' : 'footer-item group';
			let handleClick = () => {
				that.handleClick.call(that, index);
			};

			return (
				<div onClick={
					handleClick
				} key={index} className={footerClazz} style={item.styleObj}>
					<div className="item price">￥{Number(item.price).toFixed(2)}</div>
					<div className="item label">
						{item.label}
						<span className="arrow">{item.arrow}</span>
					</div>
				</div>
			)
		});

		!!this.props.goHome && footerContent.unshift(
			<div className="go-home footer-item" onClick={this.handleHomeClick.bind(this)} key="home">
				<div className="icon-home"></div>
				<div className="txt-home">首页</div>
			</div>
		);

		return (
			<footer className="m-groupitemdetailfooter">
				{footerContent}
			</footer>
		)
	}
}