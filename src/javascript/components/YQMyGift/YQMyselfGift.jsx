import React, { PropTypes } from 'react';
import './YQMyselfGift.scss';
import Util from "extend/common/util";
import DateUtil from "extend/common/DateUtil";
import RequestUtil from "extend/common/RequestUtil";
import RedirectUtil from "extend/common/RedirectUtil";
import Notification from 'components/Notification/Notification';
import shareData from "data/YQData/shareData.json";
import icon from "images/YQGift/icon.png";

class YQMyselfGift extends React.Component {
	constructor(props) {
		super(props);

		this.state ={
			enter: false,  //提示信息显示
			message: null,  //提示信息显示内容
		}
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

	/**
	 * [GetSkuProductList 根据礼盒Id 返回礼盒详细信息]
	 */
	GetGiftStatus(callback) {
		let that = this;
		let item = this.props.item;
		let param = {
			url : 'gift/pulllist',
			method : 'GET',
			data: {
				giftId: item.giftId,
				userId: Util.fetchUserId(),
			},
			successFn : function (result) {
                if (RequestUtil.isResultSuccessful(result)) {
					let {giftDetailStatus} = result.result.data[0];
					callback && callback(giftDetailStatus);

                }else{
					that.enter(result.message);
                }
			},
			errorFn : function () {
				that.enter("网络错误，请稍后再试");
			}
		};

		RequestUtil.fetchYQ(param);
	}
	
	/**
	 * [RedirectByGiftStatus 根据礼盒装填判断跳转或者提示信息]
	 */
	RedirectByGiftStatus(status) {
		let that = this;
		let item = this.props.item;
		let detail_url ="";

		//获取礼盒状态
		if(status == 4 ) {
			//alert("抱歉！该礼盒已过期!");
			that.enter("抱歉！该礼盒已过期!");
			
		}else if(status == 2 ) {
			let  redirect_url=RedirectUtil.getPageUrlByPageName("YQGiftStatus");

			RedirectUtil.redirectPage({
				pageName: "YQDeliveryAddr",
				options: Object.assign({
					funcType:'select',
					giftId:item.giftId,
					redirect_url:redirect_url,
				}, {}),
			});
		}else {
			RedirectUtil.redirectPage({
				pageName: "YQGiftStatus",
				options: Object.assign({
					giftId:item.giftId,
				}, {}),
			});

		}
	}

	RedirectJudge() {
		let that = this;
		that.GetGiftStatus(that.RedirectByGiftStatus.bind(that));
	}


    render() {
    	let that = this;
		let item = this.props.item;
		
		let benediction = (item.benediction ===null || item.benediction === "") ? shareData.defaultTitle : item.benediction;
		let {YEAR,MONTH,DAY,HOURS,MINUTES} = DateUtil.timestramptoDate(item.createTime);
		let createTime = YEAR+"年"+MONTH+"月"+DAY+"日 "+HOURS+":"+MINUTES;

        return (
        	<div className="m-gift-list">
	        	<div className="list"  data-giftId={item.giftId} >
					<a href="javascript:;" onClick={this.RedirectJudge.bind(this)} >
						<div className="m-basic">
							<img src= {icon} />
							<div className="desc">
								{benediction}
							</div>
						</div>
						<div className="date">
							{createTime}<i className="icon link"></i>
						</div>
					</a>
				</div>
				<Notification enter={this.state.enter} leave={this.leave.bind(this)}>{this.state.message}</Notification>
	      	</div>

        );
    }
}

export default YQMyselfGift;