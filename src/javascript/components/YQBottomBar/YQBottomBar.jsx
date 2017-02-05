import React, {Component} from 'react'
import Util from "extend/common/util";
import RedirectUtil from "extend/common/RedirectUtil";

import './YQBottomBar.scss'

export default 
class YQBottomBar extends Component {
	constructor (props) {
		super(props);
	}

	handleItemClick (event) {
		let target = event.target,
			targetURL;
		while( target.parentNode.className != "m-bottom-bar" && target.className != "m-bottom-bar" ){
			target = target.parentNode;
		}
		
		let pageName = "";
		switch(target.className){
			case "bar-home-send":
				targetURL = "../YQPrdtList/index.html";
				break;
			case "bar-gift-receive":{
				if(this.props.activeIndex == 0) {
					//pageName = "YQGiftReceive";
					targetURL = "../YQGiftReceive/index.html";
				}else {
					//pageName = "YQGift";
					targetURL = "../YQGift/index.html";
				}
				break;
			}
			default:
				return;
		}
		
		// RedirectUtil.redirectPage({
		// 	pageName: pageName,
		// 	options:{},
		// });
		location.href = targetURL;
	}

	render () {
		let activeClazz = ['',''];
		activeClazz[this.props.activeIndex] = ' active';//1默认显示 我发起的团
		return (
			<div className="m-bottom-bar" onClick={this.handleItemClick.bind(this)}>
				<div className='bar-gift-receive'><span>{this.props.buttonName}</span></div>
				<div className='bar-home-send'><span className="active">我要发礼盒</span></div>
			</div>
		)
	}
}

