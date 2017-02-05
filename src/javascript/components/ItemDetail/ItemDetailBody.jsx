import React, {Component} from 'react';
import Logger from 'extend/common/Logger';
import Util from 'extend/common/util';
import './ItemDetailBody.scss';


export default
class ItemDetailBody extends Component {
	constructor(props) {
	  super(props);
	
	  this.state = {
		detailList: [
			//'http://sjyxtest.yiqiguang.com/sjyxweb/res/images/ItemDetail/img_detail_last@3X.png',
		]
	  };
	}

	handleItemClick(...args) {
		Logger.log(args);
	}

	componentWillReceiveProps(nextProps) {
		if (Util.isExisty(nextProps.detailList)) {
			this.setState({
				detailList: nextProps.detailList,
			});
		}
	}

	render() {
		let {
			detailList,
		} = this.state;
		//console.log('detailList', detailList);
		let detailImages = detailList.map(function(image, index) {
			return (
				<img key={index} src={image} />
			)
		});

		return (
			<section className="m-detailbody">
				<div className="feature"></div>
				<div className="m-detail-images">
					{detailImages}
				</div>
			</section>
		)
	}
}