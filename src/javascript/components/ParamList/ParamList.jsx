import React, {Component} from 'react';
import Util from 'extend/common/util';
import Logger from 'extend/common/Logger';
import './ParamList.scss';

export default
class ParamList extends Component {

	constructor(props) {
	  super(props);
	
	  this.state = {
	  	activeIndex: -1,
	  	paramList: [],
	  	blockIndexList: props.blockIndexList|| [],
	  	firstLoaded: true,
	  };
	}

	componentWillReceiveProps(nextProps) {
		if (Util.isExisty(nextProps.paramList)) {
			this.setState({
				paramList: nextProps.paramList,
			});
		}

		if (Util.isExisty(nextProps.blockIndexList)) {
			this.setState({
				blockIndexList: nextProps.blockIndexList,
			}, () => {
				this.resetDefaultIndex();
			});
		}
	}

	resetDefaultIndex() {
		let {
			firstLoaded,
			blockIndexList,
			paramList,
		} = this.state;

		if (firstLoaded) {

			// let activeIndex = this.getActiveIndexByBlockIndexLsit(blockIndexList);
			// let targetParam = paramList.filter((param, index) => {
			// 	return index == activeIndex;
			// })[0];

			// this.setState({
			// 	firstLoaded: false,
			// }, () => {
			// 	//this.handleSelectParam(targetParam.id, activeIndex);
			// });
		}
	}

	getActiveIndexByBlockIndexLsit(list) {
		let index = 0;
		for (var i = 0, l = list.length; i < l; i++) {
			if(list[i] > index) {
				break;
			} else {
				index++;
			}
		}
		return index;
	}

	buildParamGroup(list, count) {
		let result = [];
		let tmp = [];

		list.map(function(param, index) {
			if (index && index % count == 0) {
				result.push([...tmp]);
				tmp = [];
			}
			tmp.push(param);
		});

		if (tmp.length) {
			result.push([...tmp]);
		}

		return result;
	}

	handleSelectParam(id, paramIndex) {
		let {
			blockIndexList,
		} = this.state;
		if (blockIndexList.includes(paramIndex)) return;

		if (this.state.activeIndex == paramIndex) {
			paramIndex = -1;
		}

		this.setState({
			activeIndex: paramIndex,
		}, () => {
			this.props.handleParam && this.props.handleParam(id, paramIndex);
		});
	}

	render() {
		let {
			width,
			rowCount,  
			paramList,
			blockIndexList,
			id,
			marginRight,
			name,
		} = this.props;

		let {activeIndex} = this.state;

		let that = this;
		let paramGroup = this.buildParamGroup(paramList, rowCount);
		let itemWidth = !!width ? `${parseFloat(width - (5*rowCount))/rowCount}` : document.documentElement.clientWidth/rowCount;
		let paramWidth = `${Math.floor(itemWidth)}px`;

		let paramObjectStyle = {
			width: paramWidth,
			marginRight: marginRight,
		};

		let paramListContent = paramGroup.map(function(list, groupIndex) {		
			let paramContent = list.map(function(param, paramIndex) {
				let paramKey = `param-${groupIndex}-${paramIndex}`;
				let currentIndex = groupIndex*rowCount + paramIndex;
				let isActive = (currentIndex == activeIndex);
				let clazz = isActive ? 'active' : '';
				let tagClazz = isActive ? 'tag active' : 'tag';
				let paramItemClazz = blockIndexList.includes(currentIndex) ? 'param-item block' : 'param-item';

				return (
					<div className={paramItemClazz} key={paramKey} style={paramObjectStyle}>
						<span
							className={clazz} 
							onClick={that.handleSelectParam.bind(that, id, currentIndex)} >
							{param.label}
						</span>
						<span className={tagClazz}></span>
					</div>
				);
			});

			let groupName = groupIndex == 0 ? 
							(<h2>{name}</h2>) : null;

			return (
				<div className="param-row clearfix" key={groupIndex}>
					{groupName}
					{paramContent}
				</div>
			)
		});

		return (
			<section className="m-param">
				{paramListContent}
			</section>
		)
	}
}