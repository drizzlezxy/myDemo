import React, {Component} from 'react';
import Logger from 'extend/common/Logger';
import '../GroupItemDetail/GroupItemDetailBody.scss';


export default
class GroupItemDetailBody extends Component {

	static defaultProps = {
	  featureSrc: 'http://sjyx.xinguang.com/res/images/ItemDetail/teses@3x.png'
	};

	constructor(props) {
	  super(props);
	
	  this.state = {
		detailList: props.detailList,
	  };
	}

	componentWillReceiveProps(nextProps) {
		if(!!nextProps.detailList) {
			this.setState({
				detailList: nextProps.detailList,
			})
		}
	}

	handleItemClick(...args) {
		Logger.log(args);
	}

	render() {
		let {
			detailList,
			memberList,
		} = this.state;

		let {
			featureSrc
		} = this.props;

		let detailImagesContent = detailList.map(function(image, index) {
			return (
				<img key={index} src={image} />
			)
		});

		return (
			<section className="m-groupdetailbody">
				<img src={featureSrc} className="feature" />
				<div className="m-detail-images">
					{detailImagesContent}
				</div>
			</section>
		)
	}
}