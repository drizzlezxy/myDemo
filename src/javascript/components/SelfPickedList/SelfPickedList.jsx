import React, {Component} from 'react';
import Util from 'extend/common/util';
import Logger from 'extend/common/Logger';
import './SelfPickedList.scss';

export default 
class SelfPickedList extends Component {
	constructor(props) {
	  super(props);
	
	  this.state = {
	  	isOldOrder: false,
	  	active: false,
	  	selected: props.selected || 0,
	  	list: props.list,
	  };
	}

	handleCheckClick(index) {
		if (this.state.isOldOrder) return;
		this.setState({
			selected: index,
		}, () => {
			// this.props.handleCheck && this.props.handleCheck(index);
		});
	}

	componentWillReceiveProps(nextProps) {
		if (Util.isExisty(nextProps.active)) {
			this.setState({
				active: nextProps.active,
			});
		}

		if (Util.isExisty(nextProps.isOldOrder)) {
			this.setState({
				isOldOrder: nextProps.isOldOrder,
			});
		}
	}

	handleCancel() {
		return;
		this.setState({
			active: false,
		}, () => {

		});
	}

	handleConfirm() {
		this.setState({
			active: false,
		}, () => {
			let {selected} = this.state;
			this.props.handleSelfPickedListConfirm && this.props.handleSelfPickedListConfirm(selected);
		});
	}

	render() {
		let that = this;
		let {selected, active} =  this.state;
		let selfPickedList = this.props.list.map((item, index) => {
			let listKey = `item-${index}`;
			let handleCheck = (ev) => {
				that.handleCheckClick(index);
			};
			let isActive = (index == selected);
			let radioClazz = isActive ? 'radio checked' : 'radio';
			return (
				<li 
					key={listKey} 
					className="pickedlist-item"
					onClick={handleCheck}
					>
					<div className="col-left">
						<span className={radioClazz}></span>
					</div>
					<div className="col-right">
						<div className="info">
							{item.siteName}
						</div>
					</div>
				</li>
			)
		});

		let containerClazz = active ? 'm-selfpickedlist' : 'hide';

		return (
			<div className={containerClazz}>
				<div className="mask" onClick={this.handleCancel.bind(this)}></div>
				<div className="u-selfpickedlist">
					<div className="u-header clearfix">
						<span className="label">选择自提点</span>
						<span onClick={this.handleConfirm.bind(this)} className="confirm">确定</span>
					</div>
					<div className="u-body">
						<ul className="u-pickedlist">
							{selfPickedList}
						</ul>
					</div>
				</div>
			</div>
		)
	}
}