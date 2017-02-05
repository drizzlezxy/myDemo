import React, {Component} from 'react';
import GroupStatus from 'data/groupStatus.json';
import Util from 'extend/common/util';
import './GroupItem.scss';

export default class 
GroupItem extends Component {
	constructor(props) {
	  super(props);
	
	  this.state = props;
	}

	getStatusInfoByCode(code) {
		let [statusClazz, statusText] = ['', ''];
		switch(code) {
			case GroupStatus.READY:
				statusClazz = 'ready';
				statusText = '去开团';
				break;
			case GroupStatus.OFFSALE:
				statusClazz = 'offsale';
				statusText = '已下架';
				break;
			case GroupStatus.SOLDOUT:
				statusClazz = 'offsale';
				statusText = '已售罄';
				break;
			case GroupStatus.END:
				statusClazz = 'end';
				statusText = '已结束';
				break;
			case GroupStatus.NOTREADY:
				statusClazz = 'notready';
				statusText = '未开始';
				break;
		}

		statusClazz += ' btn';

		return {
			statusClazz: statusClazz,
			statusText: statusText,
		}
	}

	componentWillReceiveProps(nextProps) {
		if (Util.isExisty(nextProps.item)) {
			this.setState(nextProps.item);
		}
	}

	handleClick() {
		this.props.item && this.props.item.handleClick && this.props.item.handleClick();
	}

	buildInvalidCountent(poSkuStatus) {
		if (poSkuStatus == GroupStatus.OFFSALE) {

		} else if (GroupStatus.SOLDOUT) {

		}
	}

	render() {
		let {item: data} = this.state;
		let {
			discount,
			groupCount,
			prdtImage,
			name,
			desc,
			unitPrice,
			marketPrice,
			skuStatus,
			poSkuStatus,
		} = data;

		let {
			statusClazz,
			statusText,
		} = this.getStatusInfoByCode(poSkuStatus);


		let invalidContent = this.buildInvalidCountent(poSkuStatus);
		
		let imageObjStyle = {
			width: `${document.documentElement.clientWidth}px`,
			height: `${document.documentElement.clientWidth}px`,
		};

		return (
			<div className="m-group-item" onClick={this.handleClick.bind(this)}>
				<div className="item-header">
					{invalidContent}
					<div className="item-img">
						<img src={prdtImage} style={imageObjStyle} />
					</div>
				</div>
				<div className="item-body">
					<div className="item-info">
						<h2 className="name">{name}</h2>
						<h3 className="desc">{desc}</h3>
					</div>
				</div>
				<div className="item-footer">
					<div className="bottom-area">
						<div className="item-extra-info">
							<span className="group-count">{groupCount}人团</span>
							<span className="sep">|</span>
							<span className="unit-price"><i className="sign">￥</i>{Number(unitPrice).toFixed(2)}</span>
							<span className="market-price">￥{Number(marketPrice).toFixed(2)}</span>
						</div>
						<div className={statusClazz}>{statusText}</div>
					</div>
				</div>
			</div>
		)
	}
}