import React, {Component} from 'react'
import Util from "extend/common/util";
import './BottomBar.scss'

export default 
class BottomBar extends Component {
	constructor (props) {
		super(props);
	}

	componentDidMount() {
	}

	handleItemClick (event) {
		let target = event.target,
			targetURL;
		while( target.parentNode.className != "m-bottom-bar" && target.className != "m-bottom-bar" ){
			target = target.parentNode;
		}
		switch(target.className){
			case "bar-home-page":
				if(this.props.activeIndex == 0) return;
				targetURL = "../HomePage/index.html";
				break;
			case "bar-fight-group":
				if(this.props.activeIndex == 1) return;
				targetURL = "../GroupSkuDetail/index.html";
				break;
			case "bar-cart":
				if(this.props.activeIndex == 2) return;
				targetURL = "../Cart/index.html";
				break;
			case "bar-my-profile":
				if(this.props.activeIndex == 3) return;
				targetURL = "../MyProfile/index.html";
				break;
			default:
				return;
		}
		location.href = targetURL;
	}

	render () {
		let activeClazz = ['','','',''];
		activeClazz[this.props.activeIndex] = ' active';
		return <div className="m-bottom-bar" onClick={this.handleItemClick.bind(this)}>
				<div className="bar-home-page"><i className={'icon icon-home-page'+activeClazz[0]}></i><span>首页</span></div>
				<div className="bar-fight-group"><i className={'icon icon-fight-group'+activeClazz[1]}></i><span>拼团</span></div>
				<div className="bar-cart"><i className={'icon icon-cart'+activeClazz[2]}></i><span>购物篮</span></div>
				<div className="bar-my-profile"><i className={'icon icon-my-profile'+activeClazz[3]}></i><span>我的</span></div>
			</div>
	}
}

