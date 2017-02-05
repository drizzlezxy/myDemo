import React, {Component} from 'react';
import Util from 'extend/common/util';
import './Tab.scss'

export default 
class Tab extends Component {
	constructor (props) {
		super(props);
		this.state = {
			activeIndex: this.props.activeIndex,
		};
	}

	componentDidMount() {
	   this.init(0);
	}

	componentWillReceiveProps(nextProps) {
		if (Util.isExisty(nextProps.activeIndex)) {
			this.init(nextProps.activeIndex);
		}
	}

	handleItemClick (item, index) {
		this.transformBar(index);
		if (this.props.handleItemClick) {
			this.props.handleItemClick(item, index);
		}
	}

	transformBar (index) {
		let bar = this.refs['bar'];
		let tab = this.refs['tab'];
		let itemWidth = Math.ceil($(tab).outerWidth() / this.props.tabs.length);
		let barStyle = {
			position: 'absolute',
			width: `${itemWidth}px`,
			height: '3px',
			left: '0px',
			bottom: '12px',
			transition: 'all .3s ease-in-out',
			WebkitTransition: 'all .3s ease-in-out',
			transform: `translate3d(0, ${index * itemWidth}px, 0)`,
			WebkitTransform: `translate3d(${index * itemWidth}px, 0, 0)`,
		};
		$(bar).css(barStyle);

		this.setState({
			activeIndex: index
		}, () => {
		});
	}

	init (index) {
		setTimeout(function (){
			this.transformBar(index || 0);
		}.bind(this), 0);
	}

	render () {
		let _this = this;
		let activeIndex = this.state.activeIndex;
		let tabs = this.props.tabs.map(function (item, index) {
			let clazz = (index != activeIndex) ? 'tab-item' : 'active tab-item';
			return (
				<li onClick={() => {
					_this.handleItemClick(item, index);
				}} className={clazz} key={index}>
					{item}
				</li>
			)
		});
		let tabClazz = 'm-tab';

		if (this.props.isTopTab) {
			tabClazz += ' top';

			if (!this.props.display) {
				tabClazz += ' hide';
			}
		}

		return (
			<ul ref="tab" className={tabClazz}>
				{tabs}
				<div ref="bar" className="h-bar"></div>
			</ul>
		)
	}
}

