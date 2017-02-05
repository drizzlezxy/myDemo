import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import Util from "extend/common/util";
import RequestUtil from "extend/common/RequestUtil";
import WeixinUtil from "extend/common/WeixinUtil";
import WeixinShareData from "data/WeixinShareData";
import Logger from "extend/common/Logger";
import BuildList from "components/BuildList/BuildList";
import ItemCard from "components/BuildList/ItemCard";
import className from 'classnames';
import StickUp from 'extend/stickUp.js';
import 'scss/base.scss';
import 'scss/SpringFestival/index.scss';

import SpringFestivalData from 'data/SpringFestival.json'

class MyComponent extends Component {
	constructor (props) {
		super(props);
	}

	componentDidMount() {
		WeixinUtil.shareByPageOption(WeixinShareData.getData('HomePage'));

		this.handleScroll();
		
		Util.lazyLoadImages($('img'), 4, 400);
	}

	handleScroll() {
		let halfHeight = document.documentElement.clientHeight / 2;
		let container = document;
		// let container = document.getElementById('app');
		let topBarS = this.refs.topBarS;
		
		let $item1 = $(topBarS).find('.bar-item-1');
		let $item2 = $item1.next();
		let $item3 = $item2.next();
		let $item4 = $item3.next();

		$(topBarS).stickUp();
		container.addEventListener('scroll', (evt) => {
			let anchor1Top = this.getElementTop(document.getElementById('anchor1'));
			let anchor2Top = this.getElementTop(document.getElementById('anchor2'));
			let anchor3Top = this.getElementTop(document.getElementById('anchor3'));
			let anchor4Top = this.getElementTop(document.getElementById('anchor4'));

			let scrollTop = $(container).scrollTop();

			if(scrollTop + halfHeight < anchor2Top) {
				this.setActiveItem($item1);

			} else if(scrollTop + halfHeight < anchor3Top) {
				this.setActiveItem($item2);

			} else if(scrollTop + halfHeight < anchor4Top) {
				this.setActiveItem($item3);
			
			} else {
				this.setActiveItem($item4);

			}
		})

	}

	setActiveItem($target) {
		$target.addClass('active').siblings().removeClass('active');
	}

	getElementTop(element){
		let actualTop = element.offsetTop;
		let current = element.offsetParent;
　　　　while (current !== null){
　　　　　　actualTop += current.offsetTop;
　　　　　　current = current.offsetParent;
　　　　}
　　　　return actualTop;
　　}

	getTopBar(refName) {
		let style = null;
		let clazz = '';
		if(refName != 'topBarS') {
			clazz = 'hide';
		}
		return (
			<div className={"bar" + clazz} ref={refName}>
				<a href="#anchor1" className="bar-item-1 active"><div className="icon"></div></a>
				<a href="#anchor2" className="bar-item-2"><div className="icon"></div></a>
				<a href="#anchor3" className="bar-item-3"><div className="icon"></div></a>
				<a href="#anchor4" className="bar-item-4"><div className="icon"></div></a>
			</div>
		)
	}

	render () {
		let insertBlocks = SpringFestivalData.blockList.map( (item, index) => {
			let title = null
			if(!!item.title) {
				title = <div className="m-title"></div>
			}

			return (
				<div className="m-block" key={index}>
					{title}
					<BuildList key={index} data={item}>
						<ItemCard lazy={true}/>
					</BuildList>
				</div>
			)

		})

		return (
			<div className="m-springfestival scroll" ref="container">
				<div className="head-img"></div>
				{this.getTopBar('topBarS')}
				{insertBlocks}
			</div>
		)
	}
}


function doRender () {
	ReactDOM.render(<MyComponent /> , document.getElementById("app"));
}

setTimeout(doRender, 16);