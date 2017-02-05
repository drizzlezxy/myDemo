import React, {Component} from 'react';

export default class ModalHeader extends Component {
	constructor (props) {
		super(props);
	}

	handleClose () {
		if (this.props.handleClose) {
			this.props.handleClose();
		}
	}

	render () {
		return (
			<div className="modal-header">
				<h2>{this.props.modal.title || 'ModalTitle'}</h2>
				<span onClick={this.handleClose} className="modal-close">x</span>
			</div>
		)
	}
}