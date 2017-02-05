import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import Util from "extend/common/util";
import Hook from "extend/common/Hook";
import SlideUp from "components/SlideUp/SlideUp";
import WeixinUtil from "extend/common/WeixinUtil";
import CookieUtil from "extend/common/CookieUtil";
import RequestUtil from "extend/common/RequestUtil";
import Logger from "extend/common/Logger";
import RNBridge from "extend/bridge/RNBridge";
import 'scss/base.scss';
import 'scss/Test/index.scss';

class MyComponent extends Component {
	
	constructor(props) {
		super(props);

		this.state = {
			logs: [],
			successMessage: '',
			errorMessage: '',
		};

		this.bridge = new RNBridge();

		console.log(this.bridge);
	}

	componentDidMount() {
		
	}

	callRN() {
		let value = this.refs['ta'].value;
		console.log('taValue', value);
		let callObj = JSON.parse(value);

		console.log('callObj', callObj);

		callObj.success = (data) => {
			this.setState({
				successMessage: data,
			});
		};

		callObj.error = (code, message, data) => {
			this.setState({
				errorMessage: data,
			});
		};

		this.bridge.callRN(callObj);
	}

	listCommands() {
		let newLogs = Util.deepClone(this.state.logs);
		console.log(this.bridge);
		newLogs.concat(this.bridge.listCommandQueue());

		this.setState({
			logs: newLogs,
		});
	}

	render() {
		let {
			logs,
			successMessage,
			errorMessage,
		} = this.state;
		let logsText = logs.join('$$$$');

		return (
			<div className="m-test">
				<p>set callRN param here</p>
				<textarea ref="ta" className="textarea"></textarea>
				<div className="btn primary" onClick={this.callRN.bind(this)}>Call RN</div>
				<div className="btn default" onClick={this.listCommands.bind(this)}>List Commands</div>

				<hr />
				<h1>Success</h1>
				<div ref="success" className="log success">{successMessage}</div>

				<h1>Error</h1>
				<div ref="error" className="log error">{errorMessage}</div>

				<h1>Command List</h1>
				<div ref="log" className="log list">{logsText}</div>
			</div>
		)
	}
}


function doRender () {
	ReactDOM.render(<MyComponent /> , document.getElementById("app"));
}

setTimeout(doRender, 16);