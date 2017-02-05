import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import Util from "extend/common/util";
import RequestUtil from "extend/common/RequestUtil";
import WeixinUtil from "extend/common/WeixinUtil";
import WeixinShareData from "data/WeixinShareData";
import RedirectUtil from "extend/common/RedirectUtil";
import Logger from "extend/common/Logger";
import GroupItemList from "components/GroupItemList/GroupItemList";
import BottomBar from "components/BottomBar/BottomBar";
import ReactPullToRefresh from 'react-pull-to-refresh';
import Notification from 'components/Notification/Notification';
import 'scss/base.scss';
import 'scss/GroupSkuDetail/index.scss';

import GroupSkuDetailState from 'states/GroupSkuDetailState';
import GroupSkuDetailAdaptor from 'extend/adaptor/GroupSkuDetailAdaptor';


class MyComponent extends Component {
	constructor (props) {
		super(props);

		let newState = GroupSkuDetailState;
		newState.limit = 10;
		newState.offset = 0;
		this.state = newState;
	}

	handleSku(...args) {
		Logger.log(args);
	}

	handleRefresh(resolve, reject) {
		Logger.log('avi');
	}

	handlePlayIntro() {
		Logger.log('intro');
	}

	componentDidMount() {
		WeixinUtil.shareByPageOption(WeixinShareData.getData('GroupSkuDetail'));

		this.resetItemList();
	}

	resetItemList() {
		let {limit, offset} = this.state;
		let param = {
			url: 'posku/list',
			method: 'GET',
			data: {
				limit: limit,
				offset: offset,
			},
			successFn: (data) => {
				if (RequestUtil.isResultSuccessful(data)) {

                	this.setState({
                		offset: offset + limit,
                		hasMore: data.result.totalCount > (offset + limit),
                	}, () => {
						this.resetPoskuList(data.result);
                	});
				}
			},
			errorFn: () => {

			},
		};

		RequestUtil.fetch(param);
	}

	resetPoskuList(result) {
		let oldItems = Util.deepClone(this.state.groupItemList);

		let newState = new GroupSkuDetailAdaptor(result).getData();
		this.setState({
			groupItemList: oldItems.concat(newState.groupItemList),
		}, () => {
			// poStatus 1是草稿 2是未开始 3是进行中 4已结束
			Logger.log(this.state);
		});

	}

	handleGroupItemClick(poSkuId, skuId, poSkuStatus) {
		const that = this;

		if (poSkuStatus == 3) {
			let param = {
				url: 'posku/check',
				data: {
					poSkuId,
					skuId,
					userId: Util.fetchUserId(),
					uid: Util.fetchUid(),
				},
				successFn: (data) => {
					if (RequestUtil.isResultSuccessful(data)) {
						RedirectUtil.redirectPage({
							pageName: 'GroupItemDetail',
							options: {
								poSkuId,
							},
						});
					} else {
						that.enter(data.message);					
					}
				},
				errorFn: () => {

				},
			};

			RequestUtil.fetch(param);
			
		}
	}

	leave() {
		this.setState({
			enter: false
		});
	}

	enter(message) {
		this.setState({
			enter: true,
			message,
		});
		setTimeout(function () {
			this.leave()
		}.bind(this), 1000)
	}

	render () {
		let {
			groupItemList,
			hasMore,
		} = this.state;

		let src = `../../../res/images/GroupSkuDetail/group_list_img_top@3x.png`;


		return (
			<div className="m-groupskudetail">
				<div className="m-header">
					<img src={src}/>
				</div>
				
				<div className="m-body">
					 
					<GroupItemList
						hasMore = {hasMore}
						resetItemList = {this.resetItemList.bind(this)}
						handleClick={this.handleGroupItemClick.bind(this)}
						data={groupItemList}
					/>

					<ReactPullToRefresh
					 onRefresh={this.handleRefresh}
					  style={{
					    textAlign: 'center'
					  }}>
					{/*<div className="m-group-more">
						报告团长~更多美味即将到来
					</div>*/}

					</ReactPullToRefresh>
				</div>
				<div className="m-footer">
					<BottomBar activeIndex='1'/>
				</div>
        		<Notification enter={this.state.enter} leave={this.leave.bind(this)}>{this.state.message}</Notification>
			</div>
		)
	}
}


function doRender () {
	ReactDOM.render(<MyComponent /> , document.getElementById("app"));
}

setTimeout(doRender, 16);