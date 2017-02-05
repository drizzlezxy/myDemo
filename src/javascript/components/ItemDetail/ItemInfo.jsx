import React, {Component} from 'react';
import Util from 'extend/common/util';
import ParamList from 'components/ParamList/ParamList';
import './ItemInfo.scss';

export default
class ItemInfo extends Component {

	constructor(props) {
	  super(props);
	
	  this.state = {
	  	basic: {
	  		name: '',
		  	desc: '',
		  	payPrice: '00.00',
		  	originPrice: '00.00',
		  	delivery: '全国包邮（港澳台和偏远地区不发货）',
		  	place: '',
		  	unitPrice: '',
		  	brandName: '',
		},
	  	paramList: this.props.paramList,
	  };
	}

	handleParam(id, paramIndex) {
		this.props.handleParam && this.props.handleParam(id, paramIndex);
	}

	componentWillReceiveProps(nextProps) {
		if (Util.isExisty(nextProps.paramList)) {
			//console.log('paramList', nextProps.paramList);
			this.setState({
				paramList: nextProps.paramList,
			});
		}

		if (Util.isExisty(nextProps.basic)) {
			this.setState({
				basic: nextProps.basic,
			});
		}
	}

	isPrdtOff(status) {
		return Util.isExisty(status) && status === 0;
	}

	render() {
		let that = this;
		let {
			basic: {
				name,
				brandName,
				desc,
				payPrice,
				originPrice,
				delivery,
				place,
				unitPrice,
				brand,
			},
			paramList,
		} = this.state;


		let paramContents = paramList.length ? paramList.map(function(paramListItem, index) {
			let {
				list,
				blockIndexList,
				id,
				rowCount,
				width,
				marginRight,
				name,
			} = paramListItem;
			let paramKey = `param-${index}`;

			return (

				<ParamList
					key={paramKey}
					width={width}
					name={name}
					marginRight={marginRight}
					rowCount={rowCount}
					paramList={list}
					blockIndexList={blockIndexList}
					handleParam={that.handleParam.bind(that)}
					id={id}
				/>
			)
		}) : null;

		if (paramList.length) {
			paramContents = (
				<div className="m-paramlist">
					{paramContents}
				</div>
			);

		}
		
		/*FIXME*/
		if(this.isPrdtOff(this.props.prdtStatus)) {
			let style = {
				padding: '0.1rem',
				lineHeight: '0.3rem',
				fontSize: '0.12rem',
				color: '#ff3600',
			}
			paramContents = <div className="prdt-token-off" style={style}>该商品已下架</div>
		}


		return (
			<div className="m-iteminfo">
				<div className="m-basic-info">
					<div className="item-name">
						【{brandName}】 {name}
					</div>
					<div className="item-desc">
						{desc}
					</div>
					<div className="item-price">
						<span className="sales-price">
							<span className="price-deco">￥</span>
							{new Number(payPrice).toFixed(2)}
						</span>
						<span className="origin-price">
							￥{Number(originPrice).toFixed(2)}
						</span>
					</div>
					
					{paramContents}

					<div className="m-deliver-addr">
						{delivery}
					</div>
				</div>
				<div className="m-extra-info">
					<div className="block">
						<div className="attr-val p1"></div>
						<div className="attr-type">新西兰</div>
					</div>
					<div className="block">
						<div className="attr-val p2"></div>
						<div className="attr-type">每周采购</div>
					</div>
					<div className="block">
						<div className="attr-val p3"></div>
						<div className="attr-type">冷藏存储</div>
					</div>
				</div>
			</div>
		)
	}
}