import React, {Component} from 'react';

export default class ModalFooter extends Component {
	constructor (props) {
		super(props);
	}

	handleClose () {
		if (this.props.handleClose) {
			this.props.handleClose();
		}
	}

	handleClick (type) {
		if (this.props.handleClick) {
			this.propts.handleClick(type);
		}
	}

	render () {
		return (
			<div className="footer-controls">
				<div className="btn-group">
					<button onClick={this.props.handleClick.bind(this, 'confirm')} className="btn btn-confrim">Confirm</button>
					<button onClick={this.props.handleClick.bind(this, 'cancel')} className="btn btn-cancel">Cancel</button>
				</div>
			</div>
		)
	}
}