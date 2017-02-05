import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import Util from "extend/common/util";
import RequestUtil from "extend/common/RequestUtil";
import WeixinUtil from "extend/common/WeixinUtil";
import Logger from "extend/common/Logger";
import YQPrdtItem from 'components/YQPrdtCard/YQPrdtItem'
import Notification from 'components/Notification/Notification';
import CONSTANTS from 'constants/YQconstants.json';
import RedirectUtil from 'extend/common/RedirectUtil';
import 'scss/base.scss';
import 'scss/YQPresentStart/index.scss';

class MyComponent extends Component {
	constructor (props) {
		super(props);

		this.state = {
			item: {
				remainCount: null,
				limitCount: null,
				invalid: false,
				status: 1, // 1:, 2:已售罄, 3:已下架,
				brandName: '',
				price: '',
				prdtImage: '',
				prdtName: '',
				spect: '',
			}, 		//商品信息
			quantity: 1, 	//购买数量
			splitNum: '',	//人数
			splitNumMax: 200,	//最大人数
			splitNumMin: 1,	// 最小人数
			enter: false,  	//提示信息显示
			message: null,  //提示信息显示内容
		}
	}

	componentDidMount() {
		WeixinUtil.hideWeixinMenu();

		this.resetPrdtItem();
	}

	resetPrdtItem() {
		const that = this;

		let param = {
			url : 'gift/poSkuDetail',
			method : 'GET',
			data: {
				poSkuId: Util.fetchValueByCurrentURL('poSkuId'),
			},
			successFn : function (result) {
                if (RequestUtil.isResultSuccessful(result)) {
                	let {
                		promotionSalePrice: price,
                		itemUrl: prdtImage,
                		skuName: prdtName,
                		skuDescription: spect,
                	} = result.result;
					
                	that.setState({
                		item: {
							remainCount: null,
							limitCount: null,
							invalid: false,
							status: 1, // 1:, 2:已售罄, 3:已下架,
							brandName: '',
							price,
							prdtImage,
							prdtName,
							spect,
						}
                	});

                }else{
					that.enter(result.message);
                }
			},
			errorFn : function () {
				that.enter("网络错误，请稍后再试");
			}
		};
		return RequestUtil.fetchYQ(param);
	}
	
	// 礼品数
	handlePrdtNumChange(num) {
		let splitNum = this.state.splitNum > num ? 
			num : 
			this.state.splitNum;
		this.setState({
			quantity: num,
			splitNum,
		});
	}

	// 人数
	handleSplitNum() {
    	$('.m-notify').css({
		    'bottom': '0%',
		    'top': '40%'
	    });

		let {splitNum, splitNumMax, splitNumMin, quantity} = this.state;
		let newSplitNum = parseInt(this.refs.splitNum.value) || '';
		let notiMsg = '';

		if(newSplitNum > splitNumMax) {
			newSplitNum = splitNum;
			notiMsg = CONSTANTS.MSG.ITEM.SPLITNUM_MAXLIMIT;

		} else if(newSplitNum > quantity) {
			newSplitNum = splitNum;
			notiMsg = CONSTANTS.MSG.ITEM.SPLITNUM_LIMIT;
		}

		!!notiMsg && this.enter(notiMsg);
		this.setState({splitNum: newSplitNum});
	}

	// 去请客
	handleTreat(totalPrice) {
		let result = this.infoValidate();
		result.success ? this.goTreat(totalPrice) : this.enter(result.msg);
	}

	infoValidate() {
		let result= {
			success: false,
			msg: '',
		}
		let {splitNum, splitNumMax, splitNumMin, quantity} = this.state;

		let items = {
			splitNum: () => {
				let newSplitNum = parseInt(splitNum) || '';

				result.success = false;
				if(!newSplitNum) {
					result.msg = CONSTANTS.MSG.ITEM.SPLITNUM_EMPTY;

				} else if(newSplitNum > splitNumMax) {
					result.msg = CONSTANTS.MSG.ITEM.SPLITNUM_MAXLIMIT;

				} else if(newSplitNum > quantity) {
					result.msg = CONSTANTS.MSG.ITEM.SPLITNUM_LIMIT;

				} else {
					result.success = true;
				}

				return result;
			},
			quantity: () => {
				let newQuantity = parseInt(quantity) || '';

				if(!newQuantity) {
					result = {
						success: false,
						msg: CONSTANTS.MSG.ITEM.SKU_EMPTY,
					}
				} else {
					result.success = true;
				}

				return result;
			},
		}

		for(let key in items) {
			let currentResult = items[key]();

			if (!currentResult.success) {
				return currentResult;
			}
		}

		return {
			success: true,
			msg: '校验通过',
		}
	}

	goTreat(totalPrice) {
		const that = this;
		let {quantity, splitNum} = this.state;
		let param = {
			url : 'gift/savegift',
			method : 'POST',
			data: {
				poSkuId: Util.fetchValueByCurrentURL('poSkuId'),
				skuId: Util.fetchValueByCurrentURL('skuId'),
				quantity,
				splitNum,
				userId: Util.fetchUserId(),
			},
			successFn : function (result) {
                if (RequestUtil.isResultSuccessful(result)) {
                	RedirectUtil.redirectPage({
                		pageName: 'YQSetGift',
                		options: {
							giftId: result.result.giftId,
							price: totalPrice,
                		},
                	})

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
		}, () => {
		    $('.m-notify').css({
		      'bottom': '0%',
		      'top': '0'
		    });
		});
	}

	render () {
		const that = this;
		let {quantity, item} = that.state;
		let totalPrice = (item.price * quantity).toFixed(2);

    	let inputType = Util.isIOS() ? 'number' : 'tel';
		return (
			<div className="m-yqpresentstart">
				<div className="m-PrdtList">
					<YQPrdtItem item={item} that={that}/>
				</div>
				<div className="m-treat-detail">
					<div className="detail-count">
						<label htmlFor="splitNum">我要请</label>
						<input type={inputType} pattern="\d*" 
							ref="splitNum" id="splitNum"
							value={this.state.splitNum}
							onChange={this.handleSplitNum.bind(this)}
							placeholder="填写个数"
						/>
						<label htmlFor="splitNum">人</label>
					</div>
					<div className="detail-total-price">
						<div className="price">总金额 <span>￥{totalPrice || '0'}</span></div>
						<div className="text">|  当前为拼手气礼盒</div>
					</div>
					<button className="btn-treat"
						onClick={this.handleTreat.bind(this, totalPrice)}
					>去请客</button>
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