import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import Util from "extend/common/util";
import './ShareModal.scss';
import 'scss/base.scss';

export default class ShareModal extends Component {
	constructor(props){
		super(props);
	}

	componentWillReceiveProps(nextProps) {
	}

	handleClick() {
		this.props.hide();
	}

	render() {
		return (
			<div className="m-share-modal" onClick={this.handleClick.bind(this)}>
				<div className="arrow"></div>
				<div className="text">
					<div>请点击右上角</div>
					<div>分享给朋友</div>
				</div>
			</div>
		)
	}
}