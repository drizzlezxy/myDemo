import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import Util from "extend/common/util";
import RequestUtil from "extend/common/RequestUtil";
import WeixinUtil from "extend/common/WeixinUtil";
import Logger from "extend/common/Logger";
import BaseList from 'components/BaseList/BaseList';
import YQPrdtCard from 'components/YQPrdtCard/YQPrdtCard';
import Notification from 'components/Notification/Notification.jsx';
import 'scss/base.scss';
import 'scss/YQPrdtList/index.scss';

class MyComponent extends Component {
	constructor (props) {
		super(props);

		this.state = {
			items: [],
			limit: 10,
			offset: 0,
			enter: false,  //提示信息显示
			message: null,  //提示信息显示内容
		}
	}

	componentDidMount() {
		WeixinUtil.hideWeixinMenu();
		
		this.resetPrdtList();
	}

	resetPrdtList() {
		const that = this;

		let {limit, offset} = that.state;
		let param = {
			url : 'gift/poSkuList',
			method : 'GET',
			data: {
				limit: limit,
				offset: offset,
			},
			successFn : function (result) {
                if (RequestUtil.isResultSuccessful(result)) {
                	result = result.result;

					let oldItems = Util.deepClone(that.state.items);
					let items = oldItems.concat(result.data);

                	that.setState({
                		items: items,
                		offset: offset + limit,
                		hasMore: result.totalCount > (offset + limit),
                	});

                }else{
					that.enter(result.message);
                }
			},
			errorFn : function () {
				that.enter("获取商品信息失败，请稍后再试");
			}
		};
		return RequestUtil.fetchYQ(param);
	}

	loadMore() {
		this.resetPrdtList();
	}

	enter(message) {
		this.setState({
			enter: true,
			message: message
		});
		setTimeout(function () {
			this.leave()
		}.bind(this), 2000)
	}

	leave() {
		this.setState({
			enter: false,
			message: ""
		});
	}

	render () {
		return (
			<div className="m-yqprdtlist">
				<BaseList clazz="m-foretaste-list" items={this.state.items} 
					loadMore={this.loadMore.bind(this)}
					hasMore={this.state.hasMore}
				>
					<YQPrdtCard />
	 			</BaseList>
				<Notification enter={this.state.enter} leave={this.leave.bind(this)}>{this.state.message}</Notification>
			</div>
		)
	}
}


function doRender () {
	ReactDOM.render(<MyComponent /> , document.getElementById("app"));
}

setTimeout(doRender, 16);