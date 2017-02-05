import React, {Component} from 'react';
import Logger from 'extend/common/Logger';
import './Footer.scss';

export default class 
Footer extends Component {
	constructor(props) {
	  super(props);
	
	  this.state = {
	  	data: props.data || [
	  		{id: 1, name: 'home',  label: '首页', href: 'aaa', isActive: false},
	  		{id: 2, name: 'group', label: '拼团',  href: 'bbb', isActive: true, },
	  		{id: 3, name: 'cart',  label: '购物篮', href: 'ccc', isActive: false},
	  		{id: 4, name: 'mine',  label: '我的',  href: 'ddd', isActive: false},
	  	]
	  };
	}

	handleDirect(href, isActive) {
		if (isActive) return;
		this.props.handleClick && this.props.handleClick(id, href);
	}

	render() {
		let {data} = this.state;
		let that = this;
		let footerContent = data.map(function(item, index) {
			let {
				id,
				name,
				label,
				href,
				isActive,
			} = item;
			let iconClazz = `${name} icon`;
			if (isActive) iconClazz += ' active';

			let handleDirect = function() {
				that.handleDirect(id, href, isActive);
			};
			return (
				<div
					key={index} 
					className="block">
					<a 
						href="javascript:void(0)"
						onClick={handleDirect}
					>
						<span className={iconClazz} ></span>
						<div className="label">
							{label}
						</div>
					</a>
				</div>
			)
		});

		return (
			<div className="m-comp-footer">
				{footerContent}
			</div>
		)
	}
}