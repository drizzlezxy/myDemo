import React, {Component} from 'react';
import GroupItem from 'components/GroupItem/GroupItem';
import './GroupSkuDetailBody.scss';


export default
class GroupSkuDetailBody extends Component {
	constructor(props) {
	  super(props);
	
	  this.state = {};
	}

	render() {

		let bodyContent = this.props.data.map(function(item, index) {
			return (
				<GroupItem
					key={index}
				/>
			)
		});

		return (
			<section className="m-groupskudetailbody">
				{bodyContent}
			</section>
		)
	}
}