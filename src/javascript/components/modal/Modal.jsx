import React, {Component} from 'react';
import Util from 'extend/util';
import './Modal.scss';


/**
 * 模态窗组件，传入动态的tpl模板和事件监听器以扩展模态窗组件的功能
 */
export default class Modal extends Component {

	constructor (props) {
		super(props);

		let modalStatus = this.props.modalStatus || {
			header : false,
			body : true,
			footer : false
		};

		this.state = {
			isShown: !!this.props.isShown || false,
			modalTpl : this.props.modalTpl || {},
			modalStatus: modalStatus
		};
	}

	componentDidMount () {
		let that = this;
		$(window).on('scroll', function () {
			if (that.state.isShown) {
				Util.throttle(that.show, that);
			}
		});

		$('.m-modal-mask').on('click', function (){
			that.hide();
		})
	}

	show () {
		this.setState({
			isShown : true
		})
	}

	hide () {
		this.setState({
			isShown : false
		})
	}

	componentWillReceiveProps (nextProps) {
		this.setState({
			isShown: nextProps.isShown
		});
	}

	getBodyHeight () {
		return $(document).height();
	}


	handleClose () {
		if (this.props.onModalClose) {
			this.props.onModalClose();
		}
			this.hide();
	}

	handleCancel () {
		this.hide();
	}

	handleModalConfirm () {
		if (this.props.handleModalConfirm) {
			this.props.handleModalConfirm();
		}
		this.hide();
	}

	render () {
		let {
				isShown, 
				modalTpl, 
				modalStatus
			} = this.state,
			that = this,
			modalTitle = this.props.title || 'Testing modal title',
			maskClazz = !!isShown ? 'm-modal-mask' : 'm-modal-mask hide',
			modalDialogClazz = !!isShown ? 'm-modal-dialog' : 'm-modal-dialog hide',
			modalHeaderClazz = !!modalStatus.header ? 'm-modal-header' : 'm-modal-header hide',
			modalBodyClazz = !!modalStatus.body ? 'm-modal-body' : 'm-modal-body hide',
			modalFooterClazz = !!modalStatus.footer ? 'm-modal-footer' : 'm-modal-footer hide',
			closeBtnClazz = !!modalStatus.hideCloseBtn ? 'modal-close hide' : 'modal-close',
			bodyHeight = this.getBodyHeight(),
			modalBody = modalTpl.body(),
			maskStyleObj = {
				position: 'fixed',
				left : 0,
				top : 0,
				width: '100%',
				height: bodyHeight + 'px',
				bacgkround: '#000',
				opacity: 0.7
			},

			modalDialogStyleObj = {
				position: 'absolute',
				left: '50%',
				top: '0.4rem',
				transform: "translateX(-50%)"
			},
			handleClose = function () {
				that.handleClose();
			},
			handleCancel = function () {
				that.handleCancel();
			},
			handleModalConfirm = function () {
				that.handleModalConfirm();
			}

		return (
			<div>
				<div className={modalDialogClazz} style={modalDialogStyleObj}>
					<span className={closeBtnClazz} onClick={handleClose}>x</span>
					<div className={modalHeaderClazz}>
						<h2>{modalTitle}</h2>
					</div>
					<div className={modalBodyClazz}>
						{modalBody}
					</div>
					<div className={modalFooterClazz}>
						<div className="modal-button-group">
							<button onClick={handleCancel} className="btn btn-cancel">Cancel</button>
							<button onClick={handleModalConfirm} className="btn btn-confirm">Confirm</button>
						</div>
					</div>
				</div>
				<div className={maskClazz} style={maskStyleObj}></div>
			</div>
		)
	}
}
