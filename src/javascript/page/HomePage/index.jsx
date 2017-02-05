import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import Util from "extend/common/util";
import RequestUtil from "extend/common/RequestUtil";
import WeixinUtil from "extend/common/WeixinUtil";
import WeixinShareData from "data/WeixinShareData";
import BuildList from "components/BuildList/BuildList";
import ItemCard from "components/BuildList/ItemCard";
import BottomBar from "components/BottomBar/BottomBar";
import 'scss/base.scss';
import 'scss/HomePage/index.scss';

import HomePageData from 'data/HomePage.json';

class MyComponent extends Component {
	constructor (props) {
		super(props);
	}

	componentDidMount() {
		WeixinUtil.shareByPageOption(WeixinShareData.getData('HomePage'));
	}

	getTitle(item) {
		let title = null;
		if(item.title){
			let imgPrefix = item.blockContent.imgPrefix;
			let titleStyle = {
				backgroundImage: `url(${imgPrefix}title.jpg)`,
			}
			
			title = <div className="m-title" style={titleStyle}></div>
		}
		return title;
	}

	render () {
		let insertBlocks = HomePageData.blockList.map( (item, index) => {
			let title = this.getTitle(item);
			return (
				<div className="m-block" key={index}>
					{title}
					<BuildList key={index} data={item}>
						<ItemCard lazy={index > 1}/>
					</BuildList>
				</div>
			)

		})
		return (
			<div className="m-homepage">
				{insertBlocks}
				<div className="to-be-continue"></div>
				<BottomBar  activeIndex='0' />
			</div>
		)
	}
}


function doRender () {
	ReactDOM.render(<MyComponent /> , document.getElementById("app"));
}

setTimeout(doRender, 16);