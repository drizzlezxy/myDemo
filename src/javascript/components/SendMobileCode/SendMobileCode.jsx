import React, { PropTypes } from 'react';
import './YQPhoneValidate.scss';
import Util from "extend/common/util";
import RequestUtil from "extend/common/RequestUtil";
import RedirectUtil from "extend/common/RedirectUtil";
import WeixinUtil from "extend/common/WeixinUtil";

class YQPhoneValidate extends React.Component { 
	constructor(props) {
		super(props);
	}
	
	render() {
		return (
			<div className="m-sendMobileCode">
				<button>12123121</button>
			</div>
		);
	}
}