/*
*进入本页面时url需携带参数：
*funcType:
*		select 		选择收货地址
*		edit		仅编辑地址
*
*redirect_url:		回调地址
*addressId: 		当前选中的地址
* 
 */

import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import Util from "extend/common/util";
import Confirm from 'components/Confirm/Confirm';
import CookieUtil from "extend/common/CookieUtil";
import RequestUtil from "extend/common/RequestUtil";
import WeixinUtil from "extend/common/WeixinUtil";
import 'scss/base.scss';
import 'scss/DeliveryAddr/index.scss';

class MyComponent extends Component {
	constructor(props) {
		super(props);

		const userId = CookieUtil.getCookie("userId");
		const uId = CookieUtil.getCookie("uid");
		
		let funcType;
		if( (Util.fetchParamValueByCurrentURL("funcType") == 'select') &&
			(!!Util.fetchParamValueByCurrentURL("redirect_url")) )
			funcType = 'select';
		else
			funcType = 'edit';

		this.state = {
			funcType: funcType,
			userId: userId,
			uId: uId,
			addrList: null,
		}
	}

	componentDidMount() {
		WeixinUtil.hideWeixinMenu();
		this.getAddrData();
	}

	getAddrData() {
		const that = this;
		let param = {
			url : 'address/getAddressList',
			method : 'POST',
			data : {
				"userId": that.state.userId,
			},
			successFn : function (result){
				if ( !!result.result ) {
					let addrList = result.result.list.map( item => that.addrItemHook(item) );
					that.setState({addrList})
				} else {
					console.log("get addrList error!")
				}
			},
			errorFn : function () {
				console.error(arguments);
			}
		};
		RequestUtil.fetch(param);
	}

	addrItemHook(item) {
		return {
			index: item.addressId,
			"data": {
				"person": {
					"name": item.name,
					"phone": item.phone,
				},
				"place": {
					"area": item.addressString ,
					"detail": item.address
				}
			},
			"isDefault": !!item.isDefault,
		}
	}

	handleEditDelete(itemIndex,event) {
		const that = this;
		switch(event.target.className){
			case "icon-edit" :
				this.go2otherPage('DeliveryAddrAdd', {addrItemIndex: itemIndex});
				break;
			case "icon-delete" :
				let confirmBox = this.refs.confirmBox;
				confirmBox.showConfirmBox(
					'提示', 
					'确认要继续删除该地址信息？', 
					function () {
						let param = {
							url : 'address/deleteResAddress',
							method : 'POST',
							data : {
								userId: that.state.userId,
								uid: that.state.uId,
								addressId: itemIndex
							},
							successFn : function (result){
								if (!!result.result && result.result == 1) {
									that.getAddrData();
								} else {
									console.log("delete addrItem error!")
								}
							},
							errorFn : function () {
								console.error(arguments);
							}
						};
						RequestUtil.fetch(param);
					}
				);
				break;
			default :
				if(that.state.funcType != "select") return;
				else {
					let confirmBox = this.refs.confirmBox;
					confirmBox.showConfirmBox(
						'提示', 
						'确认要将该地址设为收货地址？', 
						function () {
							let pureUrl = Util.fetchParamValueByCurrentURL('redirect_url');
							let options = Util.cloneObjExceptParam(Util.parseQueryString(location.href), 'redirect_url');
							options = Util.cloneObjExceptParam(options, 'funcType');
							options.addressId = itemIndex;
							location.href = Util.getRedirectUrl(pureUrl, options);
						}
					);
				}
				break;
		}
	}

	handleClick() {
		this.go2otherPage('DeliveryAddrAdd');
	}

	go2otherPage(pageName, options = {}){
		let target = Util.getNewUrlByPageName(pageName, Util.parseQueryString(location.href));

		for(let key in options) {
			target = Util.appendParam4Url(target, key, options[key]);
		}

		location.href = target;
	}

	render() {
		let {addrList, funcType} = this.state;
		let addressId = Util.fetchParamValueByCurrentURL('addressId');

		let addrItemDiv = Util.isArray(addrList) ? addrList.length > 0 ? addrList.map( (item,index)=>{
			let isDefault = item.isDefault ? "list-item default" : "list-item",
				defaultDiv = item.isDefault ? <span className="is-default">[默认]</span> : null;
			let data = item.data;

			let clazzSelect = 'icon-unselect';
			if((!addressId && item.isDefault) || (addressId == item.index)) {
				clazzSelect = 'icon-select';
			}
			return <div className={isDefault} key={index}  onClick={this.handleEditDelete.bind(this,item.index)}>
						<div className={"select-icon " + clazzSelect}></div>
						<div className="item-icon">
							<span className="icon-edit"></span>
							<span className="icon-delete"></span>
						</div>
						<div className="item-content">
							<div className="name">{data.person.name}</div>
							<div className="phone">{data.person.phone}</div>
							<div className="place">
								{defaultDiv}
								{data.place.area.replace(/-/g,'')+data.place.detail}
							</div>
						</div>
					</div>
		}) : <div className="empty">您目前还没有收货地址。</div> : <div className="empty"></div>
		return (
			<div className="m-deliveryaddr">
				<div className={"m-addr-list " + funcType}>
					{addrItemDiv}
					<div className="place-holder"></div>
				</div>
				<div className="m-btn-add" onClick={this.handleClick.bind(this)} >
					<span>新增地址</span>
				</div>
				<Confirm ref="confirmBox" />
			</div>
		)
	}
}


function doRender () {
	ReactDOM.render(<MyComponent /> , document.getElementById("app"));
}

setTimeout(doRender, 16);