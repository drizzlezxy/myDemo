import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import Util from 'extend/common/util';
import UrlUtil from 'extend/common/UrlUtil';
import RequestUtil from 'extend/common/RequestUtil';
import WeixinUtil from 'extend/common/WeixinUtil';
import CookieUtil from 'extend/common/CookieUtil';
import Notification from 'components/Notification/Notification';
import Tab from 'components/Tab/Tab';
import 'scss/base.scss';
import 'scss/Test/index.scss';

class MyComponent extends Component {
	
	constructor(props) {
		super(props);

		this.state = {
			tabTree: {
				activeIndex : 0,
				items: ['标签一','标签二','标签三','标签四'],
			},
			currentTabItems: [], // 存放当前展示的tab对象，后期做滚动加载
			notiEnter: false,  //提示信息显示
			notiMsg: '',  //提示信息显示内容
		};
	}

	componentDidMount() {
		this.notiShow('显示提示信息3秒');
	}

	/**
	 * Notification组件
	 * showNotification 	显示提示信息
	 * @param  {String} 	提示内容
	 * @param  {Number} 	提示显示时间
	 */
	notiShow(message, timeout = 3000) {
		this.setState({
			notiEnter: true,
			notiMsg: message,
		}, () => {
			setTimeout(() => {
				this.notiHide();
			}, timeout);
		});
	}


	/**
	 * Notification组件
	 * notiHide 			隐藏提示信息
	 */
	notiHide() {
		this.setState({
		  notiEnter: false,
		});
	}

	handleTabChange(item, index) {
		console.log(item, index);
	}

	initTabItems(){
		return ['列表信息一','列表信息二','列表信息三','列表信息四'].map((item, index)=>{
			return (
				<div className="list-item" key={index}>{item}</div>
			)
		})
	}

	render() {
		const that = this;
		let {
			tabTree: {
				tabActiveIndex,
				items: tabStatus,
			}
		} = this.state;
		let listItems = this.initTabItems();

		return (
			<div className="m-test">
				<div className="test-header">
					<Tab ref='topTab'
						tabs={tabStatus} 
						activeIndex={tabActiveIndex}
						context={that}
						handleItemClick={this.handleTabChange}
					/>
				</div>
				<div className="test-list">{listItems}</div>
				<Notification enter={this.state.notiEnter} leave={this.notiHide.bind(this)}>{this.state.notiMsg}</Notification>
			</div>
		)
	}
}


function doRender () {
	ReactDOM.render(<MyComponent /> , document.getElementById('app'));
}

setTimeout(doRender, 16);