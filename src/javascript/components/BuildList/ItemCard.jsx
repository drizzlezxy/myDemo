import React, {Component} from 'react';
import './ItemCard.scss';

export default class ItemCard extends Component {
	constructor(props) {
	  super(props);
	
	}

	componentDidMount() {

	}

	componentWillReceiveProps(nextProps) {

	}

	static getCard(cardType, context) {
		let card;
		switch(cardType) {
			case 0:
			default: 
				let {imgPrefix, linkPrefix, item} = context.props.itemInfo;
				let {imgUrl, linkHref} = item;
				let anchor = !!item.anchor ? item.anchor : '';
				
				card = (
					<a className="item-card" href={linkPrefix + linkHref} id={anchor}>
						{
							context.props.lazy ? 
								<img data-src={imgPrefix + imgUrl} /> : 
								<img src={imgPrefix + imgUrl} />
						}
					</a>
				)
		}
		return card;
	}

	render() {
		let context = this;
		let cardType = this.props.cardType;
		return ItemCard.getCard(cardType, context)
	}
}