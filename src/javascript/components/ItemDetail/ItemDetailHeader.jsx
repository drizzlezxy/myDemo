import React, {Component} from 'react';
import Slide from 'components/Slide/Slide';
import './ItemDetailHeader.scss';


export default
class ItemDetailHeader extends Component {
	constructor(props) {
	  super(props);
	
	  this.state = {};
	}

	render() {
		return(
			<header className="m-detailheader">
				<Slide 
				imageList={this.props.imageList} 
				/>
			</header>
		)
	}
}