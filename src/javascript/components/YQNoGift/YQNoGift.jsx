import React, { PropTypes } from 'react';
import './YQNoGift.scss';
import Util from "extend/common/util";
import RequestUtil from "extend/common/RequestUtil";
import RedirectUtil from "extend/common/RedirectUtil";
import icon_no_data from "images/YQGift/icon_no_data.jpg";

class YQNoGift extends React.Component {
	constructor(props) {
		super(props);
	}

	GoSkuList() {
		RedirectUtil.redirectPage({
			pageName: "YQPrdtList",
			options: {},
		});
	}

	GoMyGiftReceive() {
		let that = this;
		let _datatype = that.props.datatype;
		let pageName = "";
		if(_datatype == 1) {pageName = "YQGiftReceive"; }
		else {pageName = "YQGift"; }
		
		RedirectUtil.redirectPage({
			pageName: pageName,
			options: {},
		});
	}

	render() {
		let that = this;
		let isShow = that.props.show;
		let _style ={};
		isShow ? _style["display"] = "none" : _style["display"] ="block";
		
		return (
			<div className="m-nogift"  >
				<img src={icon_no_data} className="icon_no_data" />
				<p className="tip">{this.props.tip}</p>
				<a href="javascript:;"  className="btn btn_goskuList" onClick={this.GoSkuList.bind(this)}>去请客</a>
				<a href="javascript:;"  className="btn btn_mygiftreceive" onClick={this.GoMyGiftReceive.bind(this)}>{this.props.btntext}</a>
			</div>
			

		);
	}
}

export default YQNoGift;