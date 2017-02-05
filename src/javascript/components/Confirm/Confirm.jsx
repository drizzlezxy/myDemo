import React, {Component} from 'react';
import Util from 'extend/common/util';
import './Confirm.scss';

export default class Confirm extends Component {
	constructor(props){
		super(props);
		this.state = {
			shown: false,
			title: this.props.title || '确定操作',
			message: this.props.message || '确定要执行如下操作?',
			cancelText: this.props.cancelText || '取消',
			okText: this.props.okText || '确定',
			handleOK: this.props.handleOK || function () {
				this.setState({
					shown: false,
				});
			},
			handleCancel: this.props.handleCancel || function () {
				this.setState({
					shown: false,
				});
			}
		};
	}

	componentWillReceiveProps(nextProps) {
	 	if (Util.isExisty(nextProps.message)) {
 			this.setState({
 				message: nextProps.message,
 			});
 		}    
	}

	showConfirmBox (title, message, okFn, cancelFn) {
		this.setState({
			title: title,
			message: message,
			shown: true,
			handleCancel: function() {
				this.setState({
					shown: false
				}, () => {
					cancelFn && cancelFn();
				});
			},
			handleOK: function() {
				this.setState({
					shown: false
				}, () => {
					okFn && okFn();
				});
			},
		});
	}

	render() {
		let {
			title,
			cancelText,
			okText,
			message,
			shown,
			handleOK,
			handleCancel,
		} = this.state;

		let isShown = !!shown;
		let isEmptyTitle = title == '';

		let confirmMaskClazz = isShown ? 'm-confirm-mask' : 'm-confirm-mask hide';
		let confirmBoxClazz = isShown ? 'm-confirm' : 'm-confirm hide';
		let titleContent = isEmptyTitle ? '' : (<h3 className="m-header-title">{title}</h3>);
 		let maskStyleObj = isShown ? {
 			height: $(document).height(),
 		} : null;

 		let boxStyleObj = !!shown? {
 			top: parseInt(document.body.scrollTop, 10) + parseInt(document.documentElement.clientHeight, 10)/2 + 'px'
 		} : null;

		return (
			<div>
				<div className={confirmMaskClazz} style={maskStyleObj}>
				</div>
				<div className={confirmBoxClazz} style={boxStyleObj}>
					<div className="m-confirm-header">
						{titleContent}
					</div>
						<div className="m-confirm-body">{message}</div>
						<div className="m-confirm-footer">
						<div className="btn-cancel" onClick={handleCancel.bind(this)}>{cancelText}</div>
						<div className="btn-ok" onClick={handleOK.bind(this)}>{okText}</div>
					</div>
				</div>
			</div>
		)
	}
}