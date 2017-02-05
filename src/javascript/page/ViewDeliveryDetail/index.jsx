import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import Util from "extend/common/util";
import RequestUtil from "extend/common/RequestUtil";
import Logger from "extend/common/Logger";
import WeixinUtil from "extend/common/WeixinUtil";
import 'scss/base.scss';
import 'scss/ViewDeliveryDetail/index.scss';

class MyComponent extends Component {
	constructor (props) {
		super(props);

		this.state = {
			companyNameTitle: '', 
			companyName: '', 
			billTitle: '', 
			billNo: '', 
			extra: ''
		}
	}

	componentDidMount() {
		WeixinUtil.hideWeixinMenu();
		
		this.resetDeliveryDetail();
	}

	resetDeliveryDetail(callback) {
		const that = this;

		let param = {
			url: 'billroute/getBillRoute',
			method: 'post',
			data: {
				trOrderId: Util.fetchValueByCurrentURL('orderId'),
    			userId: Util.fetchUserId(),
			},
			successFn: (data) => {
				if (RequestUtil.isResultSuccessful(data)) {
					let result = data.result;
					!!result && !!result[0] ? that.initDeliveryInfo(result[0]) :
								  that.setState({extra: '暂无物流信息'});

				} else {
					that.setState({extra: data.message})
				}
			},
			errorFn: (...args) => {
				//alert('网络异常，请检查网络');
			}
		};

		RequestUtil.fetch(param);
	}

	initDeliveryInfo(data) {
		const that = this;

		switch(data.orderType) {
			case 2 : 
				that.setState({	extra: '打包完成'});
				break;

			case 3: 
				that.setState({	extra: '物业配送'})
				break;

			case 0:
			case 1:
			default:
				that.setState({
					companyNameTitle: '快递公司', 
					companyName: data.expressCompanyName,
					billTitle: '运单号', 
					billNo: data.billNo,
					extra: '商品已发货'
				});
				break;
		}
	}

	render () {
		let {
			companyNameTitle, 
			companyName, 
			billTitle, 
			billNo, 
			extra} = this.state;

		return (
			<div className="m-viewdeliverydetail">
				<div className="delivery-info">
					<div className="info-card">
						<div className="company">
							<span className="title">{companyNameTitle}</span>
							<span className="value">{companyName}</span>
						</div>
						<div className="bill-no">
							<span className="title">{billTitle}</span>
							<span className="value">{billNo}</span>
						</div>
					</div>
					<div className="send-out">
						<i className="icon"></i> 
						<span>{extra}</span>
					</div>
				</div>
			</div>
		)
	}
}


function doRender () {
	ReactDOM.render(<MyComponent /> , document.getElementById("app"));
}

setTimeout(doRender, 16);