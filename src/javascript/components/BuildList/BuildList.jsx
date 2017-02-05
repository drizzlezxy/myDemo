import React, {Component} from 'react';
import SlideWithLink from 'components/Slide/SlideWithLink';
import './BuildList.scss';

export default class BuildList extends Component {
	static listTypes = [
		'slide',
		'slider',
		'row1',
		'row1Border',
		'row2',
		'row2Border',
	];

	constructor(props) {
	  super(props);
	
	  this.state = {
	  };
	}

	componentDidMount() {

	}

	componentWillReceiveProps(nextProps) {

	}

	formatList(formType, blockContent = {}) {
		let that = this;
		let formedList = [];
		let {cardType, imgPrefix, linkPrefix, detailList} = blockContent;
		let itemCard = this.props.children;

		let getItem = (item, itemCard) => {
			return React.cloneElement(that.props.children, { cardType,
															 itemInfo: {
																item, 
																imgPrefix, 
																linkPrefix: that.getPrefix(linkPrefix, item.linkHref),
															}});
		}

		switch(formType) {
			case 'slide':
			case 'slider':
				let imageList = detailList.map( (item, index) => {

					return {
						imgUrl: imgPrefix + item.imgUrl,
						linkHref: that.getPrefix(linkPrefix, item.linkHref) + item.linkHref,
					}
				});
				formedList = <SlideWithLink
						imageList={imageList} 
						/>
				break;

			case 'row2': 
			case 'row2Border':
				formedList = detailList.map( (item, index) => {
					let clazz = ((index + 1) % 2 == 0) ? '' : 'with-right-border';
					return (
						<li key={index} className={clazz}>
							{ getItem(item, itemCard) }
						</li>
					)
				});
				break;

			case 'row1': 
			case 'row1Border':
			default:
				formedList = detailList.map( (item, index) => {
					return (
						<li key={index}>
							{ getItem(item, itemCard) }
						</li>
					)
				});
				break;
		}

		return formedList;
	}

	getPrefix(linkPrefix, linkHref) {
        let newPrefix = linkPrefix;

        if(!linkHref) {
        	newPrefix = 'javascript:void(0)';
        } else if(linkHref == '#') {
        	newPrefix = '';
        }

        return newPrefix;
	}

	render() {
		let data = this.props.data;
		let {listType, blockContent, extraStyle} = data;

		let list = this.formatList(listType, blockContent);
		!extraStyle && (extraStyle = {});

		return (
				<ul className={`m-list ${listType}`} style={extraStyle}>
					{list}
				</ul>
		)
	}
}