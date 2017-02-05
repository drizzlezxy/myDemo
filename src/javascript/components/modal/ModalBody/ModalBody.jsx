import React, {Component} from 'react';

export default class ModalBody extends Component {
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
			<div>
				ModalBody
			</div>
		)
	}
}