import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import Util from "extend/common/util";
import RequestUtil from "extend/common/RequestUtil";
import WeixinUtil from "extend/common/WeixinUtil";
import Logger from "extend/common/Logger";
import 'scss/base.scss';
import 'scss/How2Play/index.scss';

class MyComponent extends Component {
	constructor (props) {
		super(props);

		let imgs = [];
		for(let i=1; i<5; i++) {
			imgs.push(`../../../res/images/How2Play/rule${i<10 ? '0' : ''}${i}.jpg`);
		}
		this.state = {imgs};
	}

	componentDidMount() {
		WeixinUtil.hideWeixinMenu();

    	Util.lazyLoadImages($('img'), 8, 200);
	}

	render () {
		let imgs = this.state.imgs.map( (item, index) => {
			let img;
			if(index < 4) {
				img = <img src={item} />
			} else {
				img = <img data-src={item} />
			}
			return (
				<li key={index}>
					{img}
				</li>
			)
		})
		
		return (
			<div className="m-how2play">
				<ul className="rule-imgs">
					{imgs}
				</ul>
			</div>
		)
	}
}


function doRender () {
	ReactDOM.render(<MyComponent /> , document.getElementById("app"));
}

setTimeout(doRender, 16);