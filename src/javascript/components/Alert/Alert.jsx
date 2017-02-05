import React, {Component} from 'react';
import Util from 'extend/common/util';
import './Alert.scss';

export default class Alert extends Component {
	constructor(props){
		super(props);

		let {
			title = '警告操作', 
			message = '警告信息', 
			okText = '确定',
		} = this.props;

		this.state = {
			shown: false,
			title: title,
			message: message,
			okText: okText,
		};
	}

	componentWillReceiveProps(nextProps) {
	 	if (Util.isExisty(nextProps.message)) {
 			this.setState({
 				message: nextProps.message
 			});
 		}     
	}

	showAlertBox(title, message) {
		this.setState({
			title: title,
			message: message,
			shown: true,
		})
	}

	handleOK() {
		this.setState({
			shown: false,
		});
	}

	render() {
		let {
			title,
			okText,
			message,
			shown,
		} = this.state;

		let isShown = !!shown;
		let isEmptyTitle = title == '';

		let alertMaskClazz = isShown ? 'm-alert-mask' : 'm-alert-mask hide';
		let alertBoxClazz = isShown ? 'm-alert' : 'm-alert hide';
		let titleContent = isEmptyTitle ? '' : (<h3 className="m-header-title">{title}</h3>);
 		let maskStyleObj = isShown ? {
 			height: $(document).height()
 		} : null;

 		let boxStyleObj = isShown ? {
 			top: parseInt(document.body.scrollTop, 10) + (parseInt(document.documentElement.clientHeight, 10)/2) + 'px'
 		} : null;

		return (
			<div>
			<div className={alertMaskClazz} style={maskStyleObj}>
			</div>
			<div className={alertBoxClazz} style={boxStyleObj}>
				<div className="m-alert-header">
					{titleContent}
				</div>
					<div className="m-alert-body">
						{message}
					</div>
					<div className="m-alert-footer">
					<div className="btn-ok" onClick={this.handleOK.bind(this)}>{okText}</div>
				</div>
			</div>
			</div>
		)
	}
}